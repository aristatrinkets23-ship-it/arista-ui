import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService, getDefaultCategoryImage } from '../../core/mock/mock-data.service';
import { ProductCardData } from '../../core/models/product-card-data.model';
import { Category } from '../../core/models/category.model';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';

const DEFAULT_FALLBACK_IMAGE = '/assets/images/placeholder-jewellery.svg';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- Floating Toast Notification Banner -->
    <div class="toast-notification" *ngIf="toastMessage" [class.success]="toastType === 'success'" [class.error]="toastType === 'error'">
      <span class="toast-icon">{{ toastType === 'success' ? '✓' : '✕' }}</span>
      <span class="toast-text">{{ toastMessage }}</span>
      <button type="button" class="btn-close-toast" (click)="toastMessage = ''">&times;</button>
    </div>

    <!-- Admin Top Header Banner -->
    <section class="admin-hero">
      <div class="container hero-content">
        <div>
          <span class="hero-eyebrow">Secured Atelier Console</span>
          <h1 class="hero-title">Arista Trinkets Management Portal</h1>
          <span class="hero-user" *ngIf="adminUser">
            Logged in as: <strong>{{ adminUser.name }}</strong> ({{ adminUser.email }})
          </span>
        </div>
        <div class="hero-actions">
          <a routerLink="/" class="btn-storefront">&larr; Customer Storefront</a>
          <button type="button" class="btn-logout" (click)="onLogout()">Sign Out</button>
        </div>
      </div>
    </section>

    <!-- Main Admin Container -->
    <section class="section-padding bg-pearl">
      <div class="container">
        <!-- Analytics Cards Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="metric-label">Total Catalog Products</span>
            <span class="metric-value">{{ products.length }}</span>
            <span class="metric-sub">Active in Storefront</span>
          </div>

          <div class="metric-card">
            <span class="metric-label">Total Categories</span>
            <span class="metric-value">{{ categories.length }}</span>
            <span class="metric-sub">Collections Active</span>
          </div>

          <div class="metric-card">
            <span class="metric-label">Total Completed Orders</span>
            <span class="metric-value">{{ mockOrders.length }}</span>
            <span class="metric-sub">Active Customer Orders</span>
          </div>

          <div class="metric-card warning">
            <span class="metric-label">Low Stock Items</span>
            <span class="metric-value">{{ lowStockCount }}</span>
            <span class="metric-sub">Action Required</span>
          </div>
        </div>

        <!-- Admin Tab Controls -->
        <div class="admin-tabs">
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'categories'"
            (click)="activeTab = 'categories'"
          >
            Categories ({{ categories.length }})
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'products'"
            (click)="activeTab = 'products'"
          >
            Product Catalog ({{ products.length }})
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'orders'"
            (click)="activeTab = 'orders'"
          >
            Customer Orders ({{ mockOrders.length }})
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'credentials'"
            (click)="activeTab = 'credentials'"
          >
            ⚙ Admin Credentials
          </button>
        </div>

        <!-- TAB 1: CATEGORIES CATALOG TABLE -->
        <div *ngIf="activeTab === 'categories'" class="tab-content">
          <div class="tab-action-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-family: var(--font-serif); color: var(--brand-mocha-brown); margin: 0; font-size: 1.2rem;">Collection Categories ({{ categories.length }})</h3>
            <button type="button" class="btn-save" style="margin-top: 0; padding: 10px 22px;" (click)="openAddCategoryModal()">
              + Add New Category
            </button>
          </div>
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Category Name</th>
                  <th>Slug / Path</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="categories.length === 0">
                  <td colspan="6" style="text-align: center; padding: 36px; color: #7A6658; font-weight: 500;">
                    No data found in category catalog. Click <strong>+ Add New Category</strong> above to create collections.
                  </td>
                </tr>
                <tr *ngFor="let cat of categories">
                  <td>
                    <img [src]="cat.image" [alt]="cat.name" (error)="onTableImageError($event)" class="table-thumb" style="width: 54px; height: 54px; object-fit: cover; border-radius: 8px;" />
                  </td>
                  <td>
                    <strong>{{ cat.name }}</strong>
                  </td>
                  <td>
                    <code>/shop?category={{ cat.slug }}</code>
                  </td>
                  <td>
                    <span class="table-desc" style="max-width: 320px; display: inline-block;">{{ cat.description }}</span>
                  </td>
                  <td>
                    <span class="badge-status success">{{ cat.featured ? 'FEATURED' : 'ACTIVE' }}</span>
                  </td>
                  <td>
                    <div class="action-btns">
                      <button type="button" class="btn-action edit" (click)="editCategory(cat)">Edit</button>
                      <button type="button" class="btn-action delete" (click)="promptDeleteCategory(cat)">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 2: PRODUCT CATALOG TABLE -->
        <div *ngIf="activeTab === 'products'" class="tab-content">
          <div class="tab-action-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-family: var(--font-serif); color: var(--brand-mocha-brown); margin: 0; font-size: 1.2rem;">Product Catalog ({{ products.length }})</h3>
            <button type="button" class="btn-save" style="margin-top: 0; padding: 10px 22px;" (click)="openAddProductModal()">
              + Add New Jewellery Piece
            </button>
          </div>
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Jewel</th>
                  <th>Name & Category</th>
                  <th>Price</th>
                  <th>Compare Price</th>
                  <th>Badge</th>
                  <th>Stock Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="products.length === 0">
                  <td colspan="7" style="text-align: center; padding: 36px; color: #7A6658;">
                    No products found in catalog. Click <strong>+ Add New Jewellery Piece</strong> above to create a product.
                  </td>
                </tr>
                <tr *ngFor="let item of products">
                  <td>
                    <img
                      [src]="item.image || defaultImage"
                      [alt]="item.name"
                      (error)="onTableImageError($event)"
                      class="table-img"
                    />
                  </td>
                  <td>
                    <strong class="item-name">{{ item.name }}</strong>
                    <span class="item-category">{{ item.category }}</span>
                  </td>
                  <td>
                    <strong class="item-price">₹{{ item.price | number }}</strong>
                  </td>
                  <td>
                    <span class="item-compare" *ngIf="item.compareAtPrice">₹{{ item.compareAtPrice | number }}</span>
                    <span *ngIf="!item.compareAtPrice">-</span>
                  </td>
                  <td>
                    <span class="badge-tag" *ngIf="item.badge">{{ item.badge }}</span>
                    <span *ngIf="!item.badge">-</span>
                  </td>
                  <td>
                    <span class="stock-pill in-stock" *ngIf="item.inStock !== false">In Stock ({{ item.stockQuantity || 10 }})</span>
                    <span class="stock-pill out-stock" *ngIf="item.inStock === false">Out of Stock</span>
                  </td>
                  <td>
                    <div class="action-btns">
                      <button type="button" class="btn-action edit" (click)="editProduct(item)">Edit Product</button>
                      <button type="button" class="btn-action delete" (click)="promptDeleteProduct(item)">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 2: CUSTOMER ORDERS TABLE -->
        <div *ngIf="activeTab === 'orders'" class="tab-content">
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Customer Details</th>
                  <th>Payment Method</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Fulfillment Status</th>
                  <th>Update Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="mockOrders.length === 0">
                  <td colspan="7" style="text-align: center; padding: 36px; color: #7A6658; font-weight: 500;">
                    No data found in customer orders. New customer orders will appear here.
                  </td>
                </tr>
                <tr *ngFor="let order of mockOrders">
                  <td>
                    <strong class="order-no">#{{ order.number }}</strong>
                    <span class="order-date">{{ order.date }}</span>
                  </td>
                  <td>
                    <strong class="cust-name">{{ order.customer }}</strong>
                    <span class="cust-email">{{ order.email }}</span>
                  </td>
                  <td>
                    <span class="pay-method">{{ order.paymentMethod }}</span>
                  </td>
                  <td>
                    <strong class="item-price">₹{{ order.total | number }}</strong>
                  </td>
                  <td>
                    <span class="status-badge paid" *ngIf="order.paymentStatus === 'PAID'">PAID (RAZORPAY)</span>
                    <span class="status-badge pending" *ngIf="order.paymentStatus === 'PENDING'">PENDING</span>
                  </td>
                  <td>
                    <span class="status-badge shipped" *ngIf="order.status === 'SHIPPED'">SHIPPED</span>
                    <span class="status-badge processing" *ngIf="order.status === 'PROCESSING'">PROCESSING</span>
                  </td>
                  <td>
                    <select class="status-select" [value]="order.status" (change)="updateOrderStatus(order, $event)">
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 4: ADMIN CREDENTIALS & SECURITY MANAGEMENT -->
        <div *ngIf="activeTab === 'credentials'" class="tab-content">
          <div class="form-card">
            <div class="tab-action-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
              <div>
                <h3 style="font-family: var(--font-serif); color: var(--brand-mocha-brown); margin: 0; font-size: 1.25rem;">
                  Registered Admin Accounts ({{ createdAdminUsers.length }})
                </h3>
                <p style="font-size: 0.82rem; color: #666; margin: 4px 0 0 0;">
                  Manage administrator accounts registered in the database with access to the Atelier dashboard.
                </p>
              </div>
              <button type="button" class="btn-save" style="margin-top: 0; padding: 10px 22px;" (click)="openCreateAdminModal()">
                + Create New Admin User
              </button>
            </div>

            <!-- TABLE VIEW OF ADMIN USERS FROM BACKEND DATABASE -->
            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Admin Name</th>
                    <th>Email Address</th>
                    <th>Assigned Role</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngIf="createdAdminUsers.length === 0">
                    <td colspan="6" style="text-align: center; padding: 36px; color: #7A6658; font-weight: 500;">
                      No admin accounts found in database. Click <strong>+ Create New Admin User</strong> above to register an admin.
                    </td>
                  </tr>
                  <tr *ngFor="let admin of createdAdminUsers">
                    <td>
                      <strong class="item-name">{{ admin.name }}</strong>
                    </td>
                    <td>
                      <span class="cust-email">{{ admin.email }}</span>
                    </td>
                    <td>
                      <span class="badge-tag">{{ admin.role }}</span>
                    </td>
                    <td>
                      <span class="order-date">{{ admin.createdAt }}</span>
                    </td>
                    <td>
                      <span class="stock-pill in-stock">{{ admin.status || 'ACTIVE' }}</span>
                    </td>
                    <td>
                      <div class="action-btns">
                        <button type="button" class="btn-action edit" (click)="openUpdatePasswordModal(admin)">
                          Update Password
                        </button>
                        <button type="button" class="btn-action delete" (click)="promptDeleteAdminUser(admin)">
                          Revoke / Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>



      </div>
    </section>

    <!-- EDIT PRODUCT MODAL OVERLAY POPUP -->
    <div *ngIf="editingProduct" class="modal-backdrop" (click)="closeEditModal()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="form-title" style="margin:0;">Edit Product Details (#{{ editingProduct.id }})</h2>
          <button type="button" class="btn-close" (click)="closeEditModal()">&times;</button>
        </div>

        <div class="success-banner" *ngIf="editSuccessMessage" style="margin-top:16px;">
          ✓ {{ editSuccessMessage }}
        </div>

        <form (submit)="updateProduct($event)" class="product-form" style="margin-top: 16px;">
          <div class="form-row">
            <div class="form-group">
              <label>Product Name *</label>
              <input type="text" [(ngModel)]="editingProduct.name" name="editName" required />
            </div>
            <div class="form-group">
              <label>Category *</label>
              <select [(ngModel)]="editingProduct.category" name="editCategory" required>
                <option value="" disabled selected>Select Category</option>
                <option *ngFor="let cat of categories" [value]="cat.name">{{ cat.name }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Price (₹ INR) *</label>
              <input type="number" [(ngModel)]="editingProduct.price" name="editPrice" required />
            </div>
            <div class="form-group">
              <label>Compare-At Price (₹ INR)</label>
              <input type="number" [(ngModel)]="editingProduct.compareAtPrice" name="editCompareAtPrice" />
            </div>
            <div class="form-group">
              <label>Badge Highlight Tag</label>
              <select [(ngModel)]="editingProduct.badge" name="editBadge">
                <option value="">None</option>
                <option value="FEATURED">FEATURED</option>
                <option value="NEW">NEW</option>
                <option value="SALE">SALE</option>
                <option value="BESTSELLER">BESTSELLER</option>
              </select>
            </div>
          </div>

          <!-- MULTI-IMAGE SLIDESHOW GALLERY MANAGER (EDIT FORM) -->
          <div class="form-group gallery-manage-section">
            <label class="gallery-manage-header">
              <span>📸 Product Slideshow & Gallery Images</span>
              <span class="img-count-badge">
                {{ (editingProduct.images?.length || 0) }} Image(s)
              </span>
            </label>
            <p style="font-size: 0.78rem; color: #666; margin: 0 0 12px 0;">
              Upload or add multiple photos for this product. Customers will see them as an interactive slide gallery on the storefront.
            </p>

            <!-- File Upload Bar -->
            <div class="gallery-upload-bar">
              <label class="gallery-upload-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                + Upload Multiple Image Files
                <input type="file" multiple accept="image/*" (change)="onMultipleFilesSelected($event, 'edit')" style="display: none;" />
              </label>
            </div>

            <!-- Gallery Thumbnails Grid -->
            <div *ngIf="editingProduct.images && editingProduct.images.length > 0" class="gallery-grid">
              <div *ngFor="let imgUrl of editingProduct.images; let i = index" class="gallery-thumb-card">
                <span *ngIf="i === 0" class="thumb-badge main">Main Cover</span>
                <span *ngIf="i > 0" class="thumb-badge secondary">#{{ i + 1 }}</span>
                <button type="button" class="thumb-delete-btn" (click)="removeProductImage('edit', i)" title="Remove photo">&times;</button>
                <img [src]="imgUrl || defaultImage" (error)="onPreviewImageError($event)" class="thumb-img" />
                <div class="thumb-card-actions">
                  <button *ngIf="i > 0" type="button" class="pill-btn-main" (click)="setPrimaryProductImage('edit', i)" title="Set as primary main cover image">★ Main</button>
                  <span *ngIf="i === 0" class="primary-cover-label">★ Cover</span>
                  <button *ngIf="i > 0" type="button" class="pill-btn-nav" (click)="moveProductImage('edit', i, 'left')" title="Move left">‹</button>
                  <button *ngIf="i < (editingProduct.images?.length || 0) - 1" type="button" class="pill-btn-nav" (click)="moveProductImage('edit', i, 'right')" title="Move right">›</button>
                </div>
              </div>
            </div>

            <!-- Gallery Empty State Notice -->
            <div *ngIf="!editingProduct.images || editingProduct.images.length === 0" style="padding: 16px; text-align: center; background: #FFFFFF; border: 1px dashed #D5C9BD; border-radius: 8px; margin-top: 10px; font-size: 0.8rem; color: #777777;">
              📷 No product photos attached from backend. Click <strong>+ Upload Multiple Image Files</strong> above to add photos.
            </div>
          </div>
          <!-- METAL TYPES & FINISHES (MATERIALS) -->
          <div class="form-group" style="margin-top: 14px;">
            <label>Available Metal Finishes & Options (Comma-Separated)</label>
            <input
              type="text"
              [(ngModel)]="editingProduct.materialsStr"
              name="editMaterialsStr"
              placeholder="e.g. 18K Warm Gold, Sterling Silver, Rose Gold"
            />
            <p style="font-size: 0.75rem; color: #777; margin: 4px 0 0 0;">
              Metal choices shown as pills on product details page.
            </p>
          </div>

          <!-- DYNAMIC SPECIFICATIONS BUILDER -->
          <div class="form-group" style="margin-top: 14px; background: #FAF7F2; padding: 14px; border-radius: 8px; border: 1px solid #E8DFD5;">
            <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-weight: 700; color: #5B4636;">
              <span>📋 Product Specifications (Accordion Table)</span>
              <button
                type="button"
                (click)="addSpecificationRow('edit')"
                style="background: #C5A059; color: #FFF; border: none; padding: 7px 18px; border-radius: 24px; font-size: 0.8rem; font-weight: 700; cursor: pointer; box-shadow: 0 2px 6px rgba(197, 160, 89, 0.35); display: inline-flex; align-items: center; gap: 4px;"
              >
                + Add Spec Line
              </button>
            </label>

            <div *ngFor="let spec of editingProduct.specifications; let idx = index" style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
              <input
                type="text"
                [(ngModel)]="spec.label"
                [name]="'editSpecLabel_' + idx"
                placeholder="Spec Label (e.g. Karatage)"
                style="flex: 1; padding: 8px 12px; font-size: 0.82rem; border-radius: 6px; border: 1px solid #D5C9BD;"
              />
              <input
                type="text"
                [(ngModel)]="spec.value"
                [name]="'editSpecVal_' + idx"
                placeholder="Spec Value (e.g. 18K Yellow Gold)"
                style="flex: 1; padding: 8px 12px; font-size: 0.82rem; border-radius: 6px; border: 1px solid #D5C9BD;"
              />
              <button
                type="button"
                (click)="removeSpecificationRow('edit', idx)"
                style="background: transparent; color: #DC2626; border: none; padding: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.15s ease;"
                title="Delete specification line"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
            <div *ngIf="!editingProduct.specifications || editingProduct.specifications.length === 0" style="font-size: 0.78rem; color: #888; text-align: center; padding: 6px 0;">
              No specifications added yet. Click <strong>+ Add Spec Line</strong> to add key-value specifications.
            </div>
          </div>

          <!-- CARE & MAINTENANCE GUIDE -->
          <div class="form-group" style="margin-top: 14px;">
            <label>Care & Maintenance Guide</label>
            <textarea
              rows="3"
              [(ngModel)]="editingProduct.careGuide"
              name="editCareGuide"
              placeholder="e.g. Handle with care. Store in protective velvet pouch after use. Avoid contact with perfumes and hairsprays."
            ></textarea>
          </div>

          <!-- COMPLIMENTARY SHIPPING & RETURNS -->
          <div class="form-group" style="margin-top: 14px;">
            <label>Complimentary Shipping & Returns Info</label>
            <textarea
              rows="3"
              [(ngModel)]="editingProduct.shippingInfo"
              name="editShippingInfo"
              placeholder="e.g. Complimentary insured express delivery within 3-5 business days."
            ></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="closeEditModal()">Cancel</button>
            <button type="submit" class="btn-save" style="margin-top:0;">Save Product Changes</button>
          </div>
        </form>
      </div>
    </div>

    <!-- EDIT CATEGORY MODAL OVERLAY POPUP -->
    <div *ngIf="editingCategory" class="modal-backdrop" (click)="closeEditCategoryModal()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="form-title" style="margin:0;">Edit Category Details ({{ editingCategory.name }})</h2>
          <button type="button" class="btn-close" (click)="closeEditCategoryModal()">&times;</button>
        </div>

        <div class="success-banner" *ngIf="editCategorySuccessMessage" style="margin-top:16px;">
          ✓ {{ editCategorySuccessMessage }}
        </div>

        <form (submit)="updateCategory($event)" class="product-form" style="margin-top: 16px;">
          <div class="form-row">
            <div class="form-group">
              <label>Category Name *</label>
              <input
                type="text"
                [ngModel]="editingCategory.name"
                (ngModelChange)="onEditCategoryNameChange($event)"
                name="editCatName"
                required
              />
            </div>
            <div class="form-group">
              <label>Category Slug (URL Path) *</label>
              <input type="text" [(ngModel)]="editingCategory.slug" name="editCatSlug" required />
            </div>
          </div>

          <!-- MAIN POSTER IMAGE SELECTOR FOR EDIT -->
          <div class="form-group" style="margin-top: 14px;">
            <label>Upload Category Main Poster (Select from device/computer) *</label>
            <input
              #editCatFileInput
              type="file"
              accept="image/*"
              (change)="onEditCategoryFileSelected($event)"
              class="custom-file-input"
            />
            <div class="system-file-badge" *ngIf="editCategoryFileName || isDataUrl(editingCategory.image)" style="margin-top: 6px;">
              <span>✓ Selected Category Photo: <strong>{{ editCategoryFileName || 'Local Photo File' }}</strong></span>
              <button type="button" class="btn-clear-file" (click)="clearCategoryFile('edit')">✕ Clear</button>
            </div>
          </div>

          <div class="form-group">
            <label>Collection Description *</label>
            <textarea
              rows="4"
              [(ngModel)]="editingCategory.description"
              name="editCatDescription"
              placeholder="Describe this collection..."
            ></textarea>
          </div>

          <!-- Live Poster Card Preview -->
          <div class="preview-box">
            <span class="preview-label">Storefront Poster Preview:</span>
            <div class="preview-img-container" style="aspect-ratio: 16/9; max-width: 380px;">
              <img
                [src]="editingCategory.image || defaultImage"
                (error)="onPreviewImageError($event)"
                alt="Category Edit Preview"
                class="preview-img"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="closeEditCategoryModal()">Cancel</button>
            <button type="submit" class="btn-save" style="margin-top:0;">Save Category Changes</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ADD PRODUCT MODAL OVERLAY POPUP -->
    <div *ngIf="showAddProductModal" class="modal-backdrop" (click)="closeAddProductModal()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="form-title" style="margin:0;">+ Add New Jewellery Creation to Catalog</h2>
          <button type="button" class="btn-close" (click)="closeAddProductModal()">&times;</button>
        </div>

        <div class="success-banner" *ngIf="successMessage" style="margin-top:16px;">
          ✓ {{ successMessage }}
        </div>

        <form (submit)="saveProduct($event)" class="product-form" style="margin-top: 16px;">
          <div class="form-row">
            <div class="form-group">
              <label>Product Name *</label>
              <input type="text" [(ngModel)]="newProduct.name" name="name" placeholder="e.g. Royal Heritage Ruby Pendant" required />
            </div>
            <div class="form-group">
              <label>Category *</label>
              <select [(ngModel)]="newProduct.category" name="category" required>
                <option value="" disabled selected>Select Category</option>
                <option *ngFor="let cat of categories" [value]="cat.name">{{ cat.name }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Price (₹ INR) *</label>
              <input type="number" [(ngModel)]="newProduct.price" name="price" placeholder="45000" required />
            </div>
            <div class="form-group">
              <label>Compare-At Original Price (₹ INR)</label>
              <input type="number" [(ngModel)]="newProduct.compareAtPrice" name="compareAtPrice" placeholder="52000" />
            </div>
            <div class="form-group">
              <label>Badge Highlight Tag</label>
              <select [(ngModel)]="newProduct.badge" name="badge">
                <option value="">None</option>
                <option value="FEATURED">FEATURED</option>
                <option value="NEW">NEW</option>
                <option value="SALE">SALE</option>
                <option value="BESTSELLER">BESTSELLER</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label>Initial Stock Quantity</label>
            <input type="number" [(ngModel)]="newProduct.stockQuantity" name="stockQuantity" placeholder="10" />
          </div>

          <!-- MULTI-IMAGE SLIDESHOW GALLERY MANAGER (ADD FORM) -->
          <div class="form-group gallery-manage-section">
            <label class="gallery-manage-header">
              <span>📸 Product Slideshow & Gallery Images</span>
              <span class="img-count-badge">
                {{ (newProduct.images?.length || 0) }} Image(s)
              </span>
            </label>
            <p style="font-size: 0.78rem; color: #666; margin: 0 0 12px 0;">
              Upload or add multiple photos for this product. Storefront customers will see them as an interactive slide gallery.
            </p>

            <!-- File Upload Bar -->
            <div class="gallery-upload-bar">
              <label class="gallery-upload-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                + Upload Multiple Image Files
                <input type="file" multiple accept="image/*" (change)="onMultipleFilesSelected($event, 'new')" style="display: none;" />
              </label>
            </div>

            <!-- Gallery Thumbnails Grid -->
            <div *ngIf="newProduct.images && newProduct.images.length > 0" class="gallery-grid">
              <div *ngFor="let imgUrl of newProduct.images; let i = index" class="gallery-thumb-card">
                <span *ngIf="i === 0" class="thumb-badge main">Main Cover</span>
                <span *ngIf="i > 0" class="thumb-badge secondary">#{{ i + 1 }}</span>
                <button type="button" class="thumb-delete-btn" (click)="removeProductImage('new', i)" title="Remove photo">&times;</button>
                <img [src]="imgUrl || defaultImage" (error)="onPreviewImageError($event)" class="thumb-img" />
                <div class="thumb-card-actions">
                  <button *ngIf="i > 0" type="button" class="pill-btn-main" (click)="setPrimaryProductImage('new', i)" title="Set as primary main cover image">★ Main</button>
                  <span *ngIf="i === 0" class="primary-cover-label">★ Cover</span>
                  <button *ngIf="i > 0" type="button" class="pill-btn-nav" (click)="moveProductImage('new', i, 'left')" title="Move left">‹</button>
                  <button *ngIf="i < (newProduct.images?.length || 0) - 1" type="button" class="pill-btn-nav" (click)="moveProductImage('new', i, 'right')" title="Move right">›</button>
                </div>
              </div>
            </div>

            <!-- Gallery Empty State Notice -->
            <div *ngIf="!newProduct.images || newProduct.images.length === 0" style="padding: 16px; text-align: center; background: #FFFFFF; border: 1px dashed #D5C9BD; border-radius: 8px; margin-top: 10px; font-size: 0.8rem; color: #777777;">
              📷 No photo files added yet. Click <strong>+ Upload Multiple Image Files</strong> above to add photos.
            </div>
          </div>

          <div class="form-group">
            <label>Product Description & Atelier Craft Notes</label>
            <textarea rows="4" [(ngModel)]="newProduct.description" name="description" placeholder="Describe the gold karatage, diamond clarity, craftsmanship..."></textarea>
          </div>

          <!-- METAL TYPES & FINISHES (MATERIALS) -->
          <div class="form-group" style="margin-top: 14px;">
            <label>Available Metal Finishes & Options (Comma-Separated)</label>
            <input
              type="text"
              [(ngModel)]="newProduct.materialsStr"
              name="materialsStr"
              placeholder="e.g. 18K Warm Gold, Sterling Silver, Rose Gold"
            />
            <p style="font-size: 0.75rem; color: #777; margin: 4px 0 0 0;">
              Metal choices shown as pills on product details page.
            </p>
          </div>

          <!-- DYNAMIC SPECIFICATIONS BUILDER -->
          <div class="form-group" style="margin-top: 14px; background: #FAF7F2; padding: 14px; border-radius: 8px; border: 1px solid #E8DFD5;">
            <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-weight: 700; color: #5B4636;">
              <span>📋 Product Specifications (Accordion Table)</span>
              <button
                type="button"
                (click)="addSpecificationRow('new')"
                style="background: #C5A059; color: #FFF; border: none; padding: 7px 18px; border-radius: 24px; font-size: 0.8rem; font-weight: 700; cursor: pointer; box-shadow: 0 2px 6px rgba(197, 160, 89, 0.35); display: inline-flex; align-items: center; gap: 4px;"
              >
                + Add Spec Line
              </button>
            </label>

            <div *ngFor="let spec of newProduct.specifications; let idx = index" style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
              <input
                type="text"
                [(ngModel)]="spec.label"
                [name]="'specLabel_' + idx"
                placeholder="Spec Label (e.g. Karatage)"
                style="flex: 1; padding: 8px 12px; font-size: 0.82rem; border-radius: 6px; border: 1px solid #D5C9BD;"
              />
              <input
                type="text"
                [(ngModel)]="spec.value"
                [name]="'specVal_' + idx"
                placeholder="Spec Value (e.g. 18K Yellow Gold)"
                style="flex: 1; padding: 8px 12px; font-size: 0.82rem; border-radius: 6px; border: 1px solid #D5C9BD;"
              />
              <button
                type="button"
                (click)="removeSpecificationRow('new', idx)"
                style="background: transparent; color: #DC2626; border: none; padding: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.15s ease;"
                title="Delete specification line"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
            <div *ngIf="!newProduct.specifications || newProduct.specifications.length === 0" style="font-size: 0.78rem; color: #888; text-align: center; padding: 6px 0;">
              No specifications added yet. Click <strong>+ Add Spec Line</strong> to add key-value specifications.
            </div>
          </div>

          <!-- CARE & MAINTENANCE GUIDE -->
          <div class="form-group" style="margin-top: 14px;">
            <label>Care & Maintenance Guide</label>
            <textarea
              rows="3"
              [(ngModel)]="newProduct.careGuide"
              name="careGuide"
              placeholder="e.g. Handle with care. Store in protective velvet pouch after use. Avoid contact with perfumes and hairsprays."
            ></textarea>
          </div>

          <!-- COMPLIMENTARY SHIPPING & RETURNS -->
          <div class="form-group" style="margin-top: 14px;">
            <label>Complimentary Shipping & Returns Info</label>
            <textarea
              rows="3"
              [(ngModel)]="newProduct.shippingInfo"
              name="shippingInfo"
              placeholder="e.g. Complimentary insured express delivery within 3-5 business days."
            ></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="closeAddProductModal()">Cancel</button>
            <button type="submit" class="btn-save" style="margin-top:0;">+ Publish Product to Storefront</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ADD CATEGORY MODAL OVERLAY POPUP -->
    <div *ngIf="showAddCategoryModal" class="modal-backdrop" (click)="closeAddCategoryModal()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="form-title" style="margin:0;">+ Add New Collection Category</h2>
          <button type="button" class="btn-close" (click)="closeAddCategoryModal()">&times;</button>
        </div>

        <div class="success-banner" *ngIf="categorySuccessMessage" style="margin-top:16px;">
          ✓ {{ categorySuccessMessage }}
        </div>
        <div class="error-banner" *ngIf="categoryErrorMessage" style="margin-top:16px;">
          ✕ {{ categoryErrorMessage }}
        </div>

        <form (submit)="onAddCategory($event)" class="product-form" style="margin-top: 16px;">
          <div class="form-row">
            <div class="form-group">
              <label>Category Name *</label>
              <input
                type="text"
                [ngModel]="newCategory.name"
                (ngModelChange)="onCategoryNameChange($event)"
                name="catName"
                placeholder="e.g. Diamond Pendants"
                required
              />
            </div>
            <div class="form-group">
              <label>Category Slug (URL Path) *</label>
              <input
                type="text"
                [(ngModel)]="newCategory.slug"
                name="catSlug"
                placeholder="e.g. diamond-pendants"
                required
              />
            </div>
          </div>

          <!-- MAIN POSTER IMAGE SELECTOR FROM DEVICE -->
          <div class="form-group" style="margin-top: 14px;">
            <label>Upload Category Main Poster (Select from device/computer) *</label>
            <input
              #catFileInput
              type="file"
              accept="image/*"
              (change)="onCategoryFileSelected($event)"
              class="custom-file-input"
            />
            <div class="system-file-badge" *ngIf="newCategoryFileName || isDataUrl(newCategory.image)" style="margin-top: 6px;">
              <span>✓ Selected Category Photo: <strong>{{ newCategoryFileName || 'Local Photo File' }}</strong></span>
              <button type="button" class="btn-clear-file" (click)="clearCategoryFile('new')">✕ Clear</button>
            </div>
          </div>

          <div class="form-group">
            <label>Collection Description *</label>
            <textarea
              rows="4"
              [(ngModel)]="newCategory.description"
              name="catDescription"
              placeholder="Describe this collection's craftsmanship, materials, and aesthetic appeal..."
            ></textarea>
          </div>

          <!-- Live Poster Card Preview -->
          <div class="preview-box" *ngIf="newCategory.image">
            <span class="preview-label">Selected Poster Preview:</span>
            <div class="preview-img-container" style="aspect-ratio: 16/9; max-width: 380px;">
              <img
                [src]="newCategory.image"
                (error)="onPreviewImageError($event)"
                alt="Category Poster Preview"
                class="preview-img"
              />
            </div>
          </div>
          <div *ngIf="!newCategory.image" style="padding: 14px; background: rgba(0,0,0,0.02); border: 1px dashed var(--color-border); border-radius: var(--radius-sm); font-size: 0.82rem; color: #777; text-align: center; margin-top: 10px;">
            📷 No category poster selected. Click <strong>Choose file</strong> above to select an image from your device.
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="closeAddCategoryModal()">Cancel</button>
            <button type="submit" class="btn-save" style="margin-top:0;">+ Publish Category to Storefront</button>
          </div>
        </form>
      </div>
    </div>

    <!-- CREATE NEW ADMIN USER MODAL OVERLAY POPUP -->
    <div *ngIf="showCreateAdminModal" class="modal-backdrop" (click)="closeCreateAdminModal()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="form-title" style="margin:0;">+ Create New Admin User Account</h2>
          <button type="button" class="btn-close" (click)="closeCreateAdminModal()">&times;</button>
        </div>

        <div class="error-banner" *ngIf="newAdminErrorMessage" style="margin-top:16px;">
          ⚠ {{ newAdminErrorMessage }}
        </div>

        <form (submit)="onCreateAdmin($event)" class="product-form" style="margin-top: 16px;">
          <div class="form-group">
            <label>Admin Full Name *</label>
            <input type="text" [(ngModel)]="newAdminForm.name" name="newAdminName" placeholder="e.g. Executive Director" required />
          </div>

          <div class="form-group">
            <label>Admin Email Address *</label>
            <input type="email" [(ngModel)]="newAdminForm.email" name="newAdminEmail" placeholder="admin@aristatrinkets.com" required />
          </div>

          <div class="form-group">
            <label>Initial Password *</label>
            <div class="password-field-wrapper">
              <input
                [type]="showNewAdminPassword ? 'text' : 'password'"
                [(ngModel)]="newAdminForm.password"
                name="newAdminPassword"
                placeholder="••••••••••••"
                required
              />
              <button
                type="button"
                class="btn-toggle-eye"
                (click)="showNewAdminPassword = !showNewAdminPassword"
                [title]="showNewAdminPassword ? 'Hide Password' : 'Show Password'"
              >
                <svg *ngIf="!showNewAdminPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg *ngIf="showNewAdminPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="closeCreateAdminModal()">Cancel</button>
            <button type="submit" class="btn-save" style="margin-top:0;">+ Register Admin User</button>
          </div>
        </form>
      </div>
    </div>

    <!-- UPDATE ADMIN PASSWORD MODAL OVERLAY POPUP -->
    <div *ngIf="showUpdatePasswordModal" class="modal-backdrop" (click)="closeUpdatePasswordModal()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="form-title" style="margin:0;">Update Admin Password ({{ editingAdminUser?.name }})</h2>
          <button type="button" class="btn-close" (click)="closeUpdatePasswordModal()">&times;</button>
        </div>

        <p style="font-size: 0.85rem; color: #666; margin: 8px 0 0 0;">
          Account Email: <strong>{{ editingAdminUser?.email }}</strong>
        </p>

        <div class="error-banner" *ngIf="updatePasswordErrorMessage" style="margin-top:16px;">
          ⚠ {{ updatePasswordErrorMessage }}
        </div>

        <form (submit)="onUpdateAdminPassword($event)" class="product-form" style="margin-top: 16px;">
          <div class="form-group">
            <label>New Secret Password *</label>
            <div class="password-field-wrapper">
              <input
                [type]="showNewPasswordInputText ? 'text' : 'password'"
                [(ngModel)]="newPasswordInput"
                name="newAdminPassInput"
                placeholder="Enter new secret password..."
                required
              />
              <button
                type="button"
                class="btn-toggle-eye"
                (click)="showNewPasswordInputText = !showNewPasswordInputText"
                [title]="showNewPasswordInputText ? 'Hide Password' : 'Show Password'"
              >
                <svg *ngIf="!showNewPasswordInputText" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg *ngIf="showNewPasswordInputText" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="closeUpdatePasswordModal()">Cancel</button>
            <button type="submit" class="btn-save" style="margin-top:0;">Save New Password</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Logout Confirmation Modal Overlay -->
    <div class="logout-modal-backdrop" *ngIf="showLogoutModal" (click)="cancelLogout()">
      <div class="logout-modal-card" (click)="$event.stopPropagation()">
        <div class="modal-icon-wrap">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>
        <h3 class="modal-title">Confirm Sign Out</h3>
        <p class="modal-desc">Are you sure you want to sign out of the Arista Management Portal?</p>
        <div class="modal-actions">
          <button type="button" class="modal-btn-cancel" (click)="cancelLogout()">Cancel</button>
          <button type="button" class="modal-btn-confirm" (click)="confirmLogout()">Sign Out &rarr;</button>
        </div>
      </div>
    </div>

    <!-- Item Delete Confirmation Modal Overlay -->
    <div class="logout-modal-backdrop" *ngIf="deleteTarget" (click)="cancelDelete()">
      <div class="logout-modal-card" (click)="$event.stopPropagation()">
        <div class="modal-icon-wrap" style="background: #FFEBEE; color: #C62828; border-color: #FFCDD2;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </div>
        <h3 class="modal-title">Confirm Delete {{ deleteTarget.type === 'product' ? 'Product' : (deleteTarget.type === 'category' ? 'Category' : 'Admin User') }}</h3>
        <p class="modal-desc">
          Are you sure you want to delete <strong>"{{ deleteTarget.name }}"</strong>? This action cannot be undone and will revoke admin dashboard access.
        </p>
        <div class="modal-actions">
          <button type="button" class="modal-btn-cancel" (click)="cancelDelete()">Cancel</button>
          <button type="button" class="modal-btn-confirm" style="background: #DC3545;" (click)="confirmDelete()">
            Delete {{ deleteTarget.type === 'product' ? 'Product' : (deleteTarget.type === 'category' ? 'Category' : 'Admin User') }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .logout-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(26, 18, 11, 0.75);
      backdrop-filter: blur(5px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.2s ease-out;
    }

    .logout-modal-card {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 32px 28px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
      animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-icon-wrap {
      width: 52px;
      height: 52px;
      margin: 0 auto 16px auto;
      background: var(--brand-pearl-beige);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--brand-warm-gold);
      border: 1px solid rgba(207, 168, 116, 0.4);
    }

    .modal-title {
      font-family: var(--font-serif);
      font-size: 1.45rem;
      font-weight: 700;
      color: var(--brand-mocha-brown);
      margin-bottom: 8px;
    }

    .modal-desc {
      font-size: 0.92rem;
      color: #666666;
      line-height: 1.55;
      margin-bottom: 24px;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .modal-btn-cancel {
      flex: 1;
      padding: 12px 18px;
      min-height: 44px;
      border: 1px solid var(--color-border);
      background: #FFFFFF;
      color: var(--brand-mocha-brown);
      border-radius: var(--radius-full);
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .modal-btn-cancel:hover {
      background: var(--brand-pearl-beige);
    }

    .modal-btn-confirm {
      flex: 1;
      padding: 12px 18px;
      min-height: 44px;
      border: none;
      background: var(--brand-mocha-brown);
      color: #FFFFFF;
      border-radius: var(--radius-full);
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .modal-btn-confirm:hover {
      background: #2D1E14;
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .toast-notification {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 99999;
      padding: 12px 18px 12px 20px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: min(540px, calc(100vw - 32px));
      animation: fadeInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .toast-notification.success {
      background: #1B5E20;
      color: #FFFFFF;
      border: 1px solid #4CAF50;
    }

    .toast-notification.error {
      background: #B71C1C;
      color: #FFFFFF;
      border: 1px solid #EF5350;
    }

    .toast-icon {
      font-weight: 700;
      font-size: 1.1rem;
      flex-shrink: 0;
    }

    .toast-text {
      flex: 1;
      line-height: 1.4;
      word-break: break-word;
    }

    .btn-close-toast {
      background: rgba(255, 255, 255, 0.22);
      border: none;
      color: #FFFFFF;
      width: 28px;
      height: 28px;
      min-width: 28px;
      border-radius: 50%;
      font-size: 1.1rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.2s ease;
      margin-left: 4px;
    }
    .btn-close-toast:hover {
      background: rgba(255, 255, 255, 0.4);
      transform: scale(1.08);
    }

    .admin-hero {
      background: var(--brand-mocha-brown);
      color: #FFFFFF;
      padding: 36px 0;
      border-bottom: 1px solid var(--brand-warm-gold);
    }

    .hero-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .hero-eyebrow {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--brand-warm-gold);
      display: block;
      margin-bottom: 4px;
    }

    .hero-title {
      font-family: var(--font-serif);
      font-size: 1.85rem;
      color: #FFFFFF;
      margin: 0 0 6px 0;
    }

    .hero-user {
      font-size: 0.85rem;
      color: #E2B882;
      display: block;
    }

    .hero-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .btn-storefront {
      color: var(--brand-warm-gold);
      font-weight: 600;
      text-decoration: none;
      font-size: 0.88rem;
      border: 1px solid var(--brand-warm-gold);
      padding: 8px 20px;
      border-radius: 50px;
      transition: all var(--transition-fast);
    }

    .btn-storefront:hover {
      background: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
    }

    .btn-logout {
      background: transparent;
      color: #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.4);
      font-weight: 600;
      font-size: 0.88rem;
      padding: 8px 20px;
      border-radius: 50px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .btn-logout:hover {
      background: var(--brand-warm-gold);
      border-color: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      transform: translateY(-1px);
    }

    .bg-pearl {
      background-color: var(--brand-pearl-beige);
      min-height: 80vh;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    @media (min-width: 576px) {
      .metrics-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (min-width: 992px) {
      .metrics-grid { grid-template-columns: repeat(4, 1fr); }
    }

    .metric-card {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 20px;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-sm);
    }

    .metric-card.warning {
      border-left: 4px solid var(--brand-warm-gold);
    }

    .metric-label {
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--color-text-muted);
      font-weight: 600;
      margin-bottom: 6px;
    }

    .metric-value {
      font-family: var(--font-serif);
      font-size: 2rem;
      font-weight: 700;
      color: var(--brand-mocha-brown);
      margin-bottom: 4px;
    }

    .metric-sub {
      font-size: 0.78rem;
      color: var(--brand-warm-gold);
      font-weight: 600;
    }

    @media (max-width: 576px) {
      .admin-hero { padding: 24px 0; }
      .hero-title { font-size: 1.35rem; }
      .hero-actions { width: 100%; justify-content: flex-start; }
      .btn-storefront, .btn-logout { flex: 1; text-align: center; padding: 8px 10px; font-size: 0.8rem; }
    }

    .admin-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 14px;
    }

    .tab-btn {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      font-family: var(--font-sans);
      font-weight: 600;
      font-size: 0.88rem;
      color: var(--brand-mocha-brown);
      padding: 10px 22px;
      border-radius: 50px;
      cursor: pointer;
      white-space: nowrap;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
    }

    @media (max-width: 768px) {
      .admin-tabs {
        gap: 6px;
      }
      .tab-btn {
        flex: 1 1 calc(50% - 6px);
        font-size: 0.82rem;
        padding: 10px 12px;
        white-space: normal;
        text-align: center;
        word-break: break-word;
      }
    }

    @media (max-width: 480px) {
      .tab-btn {
        flex: 1 1 100%;
      }
    }

    .tab-btn:hover {
      border-color: var(--brand-warm-gold);
      color: var(--brand-warm-gold);
    }

    .tab-btn.active {
      background: var(--brand-mocha-brown);
      color: #FFFFFF;
      border-color: var(--brand-mocha-brown);
    }

    .table-responsive {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow-x: auto;
      box-shadow: var(--shadow-sm);
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .admin-table th {
      background: var(--brand-pearl-beige);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--brand-mocha-brown);
      padding: 14px 16px;
      border-bottom: 1px solid var(--color-border);
    }

    .admin-table td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--color-border);
      vertical-align: middle;
      font-size: 0.9rem;
    }

    .table-img {
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: var(--radius-sm);
      background: var(--brand-pearl-beige);
      border: 1px solid var(--color-border);
    }

    .item-name { display: block; color: var(--brand-mocha-brown); }
    .item-category { font-size: 0.78rem; color: var(--color-text-muted); }
    .item-price { color: var(--brand-mocha-brown); }
    .item-compare { text-decoration: line-through; color: var(--color-text-muted); font-size: 0.85rem; }

    .badge-tag {
      background: var(--brand-soft-blush);
      color: var(--brand-mocha-brown);
      font-size: 0.7rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
    }

    .stock-pill {
      font-size: 0.78rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 12px;
    }
    .stock-pill.in-stock { background: #E8F5E9; color: #2E7D32; }
    .stock-pill.out-stock { background: #FFEBEE; color: #C62828; }

    .action-btns { display: flex; gap: 8px; }
    .btn-action {
      border: none;
      padding: 6px 16px;
      border-radius: 50px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .btn-action.edit { background: var(--brand-pearl-beige); color: var(--brand-mocha-brown); }
    .btn-action.edit:hover { background: var(--brand-warm-gold); }
    .btn-action.delete { background: #FFEBEE; color: #C62828; }
    .btn-action.delete:hover { background: #FFCDD2; }

    @media (max-width: 576px) {
      .form-card { padding: 18px 14px; }
      .modal-card { padding: 18px 14px; max-height: 92vh; }
      .action-btns { flex-direction: column; gap: 6px; }
    }

    .form-card {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 28px;
      box-shadow: var(--shadow-sm);
    }

    .form-title {
      font-family: var(--font-serif);
      color: var(--brand-mocha-brown);
      font-size: 1.4rem;
      margin-bottom: 20px;
    }

    .input-with-btn {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .input-with-btn select {
      flex: 1;
    }

    .btn-browse {
      background: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      border: 1px solid var(--brand-warm-gold);
      padding: 10px 16px;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: background var(--transition-fast);
    }
    .btn-browse:hover {
      background: #E2B882;
    }

    .system-file-notice {
      font-size: 0.8rem;
      color: #2E7D32;
      margin-top: 4px;
      display: block;
    }

    .system-file-badge {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #E8F5E9;
      border: 1px solid #A5D6A7;
      color: #2E7D32;
      font-size: 0.82rem;
      padding: 8px 14px;
      border-radius: var(--radius-sm);
    }

    .custom-file-input {
      display: block;
      width: 100%;
      padding: 8px 12px;
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
      font-family: var(--font-sans);
      cursor: pointer;
    }

    .custom-file-input::file-selector-button {
      background: var(--brand-pearl-beige);
      color: var(--brand-mocha-brown);
      border: 1px solid var(--color-border);
      padding: 6px 18px;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      margin-right: 12px;
      transition: background var(--transition-fast);
    }
    .custom-file-input::file-selector-button:hover {
      background: var(--brand-warm-gold);
    }

    .btn-clear-file {
      background: transparent;
      border: none;
      color: #C62828;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.8rem;
      padding: 2px 6px;
    }
    .btn-clear-file:hover {
      text-decoration: underline;
    }

    .success-banner {
      background: #E8F5E9;
      color: #2E7D32;
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      font-weight: 600;
      margin-bottom: 20px;
      font-size: 0.9rem;
    }

    .error-banner {
      background: #FFEBEE;
      color: #C62828;
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      font-weight: 600;
      margin-bottom: 20px;
      font-size: 0.9rem;
    }

    .product-form { display: flex; flex-direction: column; gap: 16px; }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    @media (min-width: 768px) {
      .form-row { grid-template-columns: repeat(2, 1fr); }
    }

    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--brand-mocha-brown);
    }

    .form-group input, .form-group select, .form-group textarea {
      padding: 10px 14px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-size: 0.92rem;
      font-family: var(--font-sans);
    }

    .preview-box {
      margin-top: 8px;
      padding: 12px;
      background: var(--brand-pearl-beige);
      border: 1px dashed var(--brand-warm-gold);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .preview-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--brand-mocha-brown);
    }

    .preview-img-container {
      width: 60px;
      height: 60px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      background: #FFFFFF;
      border: 1px solid var(--color-border);
    }

    .preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .btn-save {
      background-color: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 12px 28px;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-size: 0.88rem;
      margin-top: 12px;
      transition: all var(--transition-fast);
      box-shadow: 0 4px 12px rgba(197, 160, 110, 0.25);
    }
    .btn-save:hover { background-color: #E2B882; transform: translateY(-1px); }

    .credentials-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }
    @media (min-width: 992px) {
      .credentials-grid { grid-template-columns: repeat(2, 1fr); }
    }

    .order-no { display: block; color: var(--brand-mocha-brown); }
    .order-date { font-size: 0.78rem; color: var(--color-text-muted); }
    .cust-name { display: block; color: var(--brand-mocha-brown); }
    .cust-email { font-size: 0.78rem; color: var(--color-text-muted); }
    .pay-method { font-size: 0.82rem; font-weight: 600; color: var(--brand-warm-gold); }

    .status-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;
    }
    .status-badge.paid { background: #E8F5E9; color: #2E7D32; }
    .status-badge.pending { background: #FFF3E0; color: #E65100; }
    .status-badge.shipped { background: #E3F2FD; color: #1565C0; }
    .status-badge.processing { background: #F3E5F5; color: #7B1FA2; }

    .status-select {
      padding: 6px 10px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
    }

    /* EDIT MODAL POPUP STYLES */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 16px;
    }

    .modal-card {
      background: #FFFFFF;
      border-radius: var(--radius-md);
      width: 100%;
      max-width: 680px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 28px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
      border: 1px solid var(--brand-warm-gold);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 12px;
    }

    .btn-close {
      background: transparent;
      border: none;
      font-size: 1.8rem;
      line-height: 1;
      color: var(--brand-mocha-brown);
      cursor: pointer;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
      border-top: 1px solid var(--color-border);
      padding-top: 14px;
    }

    .btn-cancel {
      background: var(--brand-pearl-beige);
      color: var(--brand-mocha-brown);
      border: 1px solid var(--color-border);
      padding: 10px 24px;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .btn-cancel:hover {
      background: var(--brand-warm-gold);
    }

    .password-field-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }

    .password-field-wrapper input {
      width: 100%;
      padding-right: 42px;
    }

    .section-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .limit-badge {
      font-size: 0.78rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 12px;
      background: #E8F5E9;
      color: #2E7D32;
      border: 1px solid #A5D6A7;
    }

    .limit-badge.reached {
      background: #FFF3E0;
      color: #E65100;
      border-color: #FFE082;
    }

    .limit-reached-banner {
      background: #FFF8E1;
      color: #B78103;
      border: 1px solid #FFE082;
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      font-size: 0.88rem;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .sub-table-title {
      font-family: var(--font-serif);
      font-size: 1.1rem;
      color: var(--brand-mocha-brown);
      margin-bottom: 12px;
    }

    .btn-toggle-eye {
      position: absolute;
      right: 10px;
      background: transparent;
      border: none;
      font-size: 1.15rem;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.75;
      transition: opacity var(--transition-fast);
      user-select: none;
    }

    .btn-toggle-eye:hover {
      opacity: 1;
    }

    /* Multi-Image Gallery Manager UI Styling */
    .gallery-manage-section {
      margin-top: 18px;
      border: 1px dashed rgba(207, 168, 116, 0.6);
      padding: 16px;
      border-radius: 10px;
      background: rgba(207, 168, 116, 0.04);
      transition: border-color 0.2s;
    }

    .gallery-manage-header {
      font-weight: 700 !important;
      color: var(--brand-mocha-brown) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      margin-bottom: 4px !important;
      text-transform: none !important;
      letter-spacing: normal !important;
    }

    .img-count-badge {
      background: var(--brand-warm-gold) !important;
      color: #1A120B !important;
      font-size: 0.72rem !important;
      padding: 3px 10px !important;
      border-radius: 12px !important;
      font-weight: 700 !important;
      letter-spacing: 0.5px !important;
      text-transform: none !important;
    }

    .gallery-upload-bar {
      display: flex !important;
      gap: 10px !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      margin-bottom: 14px !important;
    }

    .form-group label.gallery-upload-btn,
    .gallery-upload-btn {
      height: 38px !important;
      min-height: 38px !important;
      max-height: 38px !important;
      padding: 0 20px !important;
      border-radius: 50px !important;
      background: var(--brand-mocha-brown) !important;
      color: #FFFFFF !important;
      font-size: 0.8rem !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 8px !important;
      border: none !important;
      white-space: nowrap !important;
      transition: all 0.2s ease !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) !important;
      text-transform: none !important;
      letter-spacing: normal !important;
      margin-bottom: 0 !important;
    }
    .form-group label.gallery-upload-btn:hover,
    .gallery-upload-btn:hover {
      background: #2D1E14 !important;
      color: #FFFFFF !important;
      transform: translateY(-1px) !important;
    }
    .gallery-upload-btn svg {
      stroke: #FFFFFF !important;
      flex-shrink: 0 !important;
    }

    .gallery-url-group {
      display: flex !important;
      gap: 6px !important;
      flex: 1 !important;
      min-width: 240px !important;
      height: 38px !important;
    }

    .form-group input.gallery-url-input,
    .gallery-url-input {
      flex: 1 !important;
      height: 38px !important;
      min-height: 38px !important;
      max-height: 38px !important;
      border: 1px solid #D5C9BD !important;
      border-radius: 6px !important;
      padding: 0 12px !important;
      font-size: 0.82rem !important;
      outline: none !important;
      background: #FFFFFF !important;
      color: #333333 !important;
      box-sizing: border-box !important;
      margin: 0 !important;
      transition: border-color 0.2s, box-shadow 0.2s !important;
    }
    .form-group input.gallery-url-input:focus,
    .gallery-url-input:focus {
      border-color: var(--brand-warm-gold) !important;
      box-shadow: 0 0 0 3px rgba(207, 168, 116, 0.18) !important;
    }

    button.gallery-add-url-btn,
    .gallery-add-url-btn {
      height: 38px !important;
      min-height: 38px !important;
      max-height: 38px !important;
      min-width: unset !important;
      padding: 0 16px !important;
      border-radius: 6px !important;
      background: var(--brand-warm-gold) !important;
      color: #1A120B !important;
      font-size: 0.8rem !important;
      font-weight: 700 !important;
      border: none !important;
      cursor: pointer !important;
      white-space: nowrap !important;
      transition: all 0.2s ease !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    button.gallery-add-url-btn:hover,
    .gallery-add-url-btn:hover {
      background: #B8925E !important;
    }

    .gallery-grid {
      display: grid !important;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)) !important;
      gap: 12px !important;
      margin-top: 12px !important;
    }

    .gallery-thumb-card {
      position: relative !important;
      border: 1px solid #E2D9CF !important;
      border-radius: 8px !important;
      overflow: hidden !important;
      background: #FFFFFF !important;
      padding: 5px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      transition: border-color 0.2s, box-shadow 0.2s !important;
    }
    .gallery-thumb-card:hover {
      border-color: var(--brand-warm-gold) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
    }

    .thumb-badge {
      position: absolute !important;
      top: 8px !important;
      left: 8px !important;
      font-size: 0.62rem !important;
      font-weight: 700 !important;
      padding: 2px 6px !important;
      border-radius: 4px !important;
      z-index: 3 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
      line-height: 1 !important;
    }
    .thumb-badge.main {
      background: var(--brand-warm-gold) !important;
      color: #1A120B !important;
      box-shadow: 0 1px 4px rgba(0,0,0,0.25) !important;
    }
    .thumb-badge.secondary {
      background: rgba(26, 18, 11, 0.7) !important;
      color: #FFFFFF !important;
      backdrop-filter: blur(2px) !important;
    }

    button.thumb-delete-btn,
    .thumb-delete-btn {
      position: absolute !important;
      top: 6px !important;
      right: 6px !important;
      background: #DC3545 !important;
      color: #FFFFFF !important;
      border: none !important;
      width: 20px !important;
      height: 20px !important;
      min-width: 20px !important;
      max-width: 20px !important;
      min-height: 20px !important;
      max-height: 20px !important;
      border-radius: 50% !important;
      cursor: pointer !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 10 !important;
      line-height: 1 !important;
      padding: 0 !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
      transition: all 0.2s ease !important;
    }
    button.thumb-delete-btn:hover,
    .thumb-delete-btn:hover {
      background: #B02A37 !important;
      transform: scale(1.15) !important;
    }

    .thumb-img {
      width: 100% !important;
      height: 80px !important;
      object-fit: cover !important;
      border-radius: 6px !important;
      display: block !important;
      background: #F7F5F2 !important;
    }

    .thumb-card-actions {
      display: flex !important;
      gap: 4px !important;
      margin-top: 6px !important;
      width: 100% !important;
      justify-content: center !important;
      align-items: center !important;
      height: 24px !important;
      min-height: 24px !important;
    }

    button.pill-btn-main,
    .pill-btn-main {
      flex: 1 !important;
      font-size: 0.65rem !important;
      font-weight: 600 !important;
      background: rgba(207, 168, 116, 0.15) !important;
      color: #5B4636 !important;
      border: 1px solid rgba(207, 168, 116, 0.4) !important;
      border-radius: 50px !important;
      padding: 0 6px !important;
      cursor: pointer !important;
      height: 24px !important;
      min-height: 24px !important;
      max-height: 24px !important;
      min-width: unset !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      white-space: nowrap !important;
      transition: all 0.15s ease !important;
    }
    button.pill-btn-main:hover,
    .pill-btn-main:hover {
      background: var(--brand-warm-gold) !important;
      color: #1A120B !important;
      border-color: var(--brand-warm-gold) !important;
    }

    button.pill-btn-nav,
    .pill-btn-nav {
      width: 24px !important;
      height: 24px !important;
      min-width: 24px !important;
      max-width: 24px !important;
      min-height: 24px !important;
      max-height: 24px !important;
      font-size: 0.75rem !important;
      font-weight: 700 !important;
      background: #F7F5F2 !important;
      color: #5B4636 !important;
      border: 1px solid #E2D9CF !important;
      border-radius: 50% !important;
      padding: 0 !important;
      cursor: pointer !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      line-height: 1 !important;
      transition: all 0.15s ease !important;
    }
    button.pill-btn-nav:hover,
    .pill-btn-nav:hover {
      background: var(--brand-mocha-brown) !important;
      color: #FFFFFF !important;
      border-color: var(--brand-mocha-brown) !important;
    }

    .primary-cover-label {
      flex: 1 !important;
      font-size: 0.62rem !important;
      font-weight: 700 !important;
      color: #8C6A3C !important;
      text-align: center !important;
      letter-spacing: 0.5px !important;
      text-transform: uppercase !important;
      line-height: 24px !important;
    }
  `]
})
export class AdminComponent implements OnInit {
  defaultImage = DEFAULT_FALLBACK_IMAGE;
  activeTab: 'products' | 'add-product' | 'categories' | 'add-category' | 'orders' | 'credentials' = 'categories';
  products: ProductCardData[] = [];
  categories: Category[] = [];
  successMessage: string = '';

  showAddProductModal: boolean = false;
  showAddCategoryModal: boolean = false;

  adminUser: any = null;
  showLogoutModal: boolean = false;
  deleteTarget: { type: 'product' | 'category' | 'user'; id: number | string; name: string } | null = null;

  editingProduct: any = null;
  editSuccessMessage: string = '';

  newSystemFileName: string = '';
  editSystemFileName: string = '';

  editingCategory: any = null;
  editCategoryFileName: string = '';
  editCategorySuccessMessage: string = '';

  newCategoryFileName: string = '';
  categorySuccessMessage: string = '';
  categoryErrorMessage: string = '';

  newCategory = {
    name: '',
    slug: '',
    description: '',
    image: ''
  };

  profileForm = {
    name: '',
    email: '',
    newPassword: ''
  };
  profileSuccessMessage: string = '';
  profileErrorMessage: string = '';
  showProfilePassword: boolean = false;

  newAdminForm = {
    name: '',
    email: '',
    password: ''
  };
  newAdminSuccessMessage: string = '';
  newAdminErrorMessage: string = '';
  showNewAdminPassword: boolean = false;

  createdAdminUsers: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    status: string;
  }> = [];

  newProduct = {
    name: '',
    category: '',
    price: '',
    compareAtPrice: '',
    badge: 'NEW',
    stockQuantity: '',
    image: '',
    images: [] as string[],
    description: '',
    materialsStr: '18K Warm Gold, Sterling Silver, Rose Gold',
    careGuide: 'Handle with care. Store in protective velvet pouch after use. Avoid contact with perfumes and hairsprays.',
    shippingInfo: 'Complimentary insured express delivery within 3-5 business days.',
    specifications: [
      { label: 'Craftsmanship', value: 'Handcrafted Atelier Finish' },
      { label: 'Certification', value: 'BIS Hallmarked Gold' }
    ] as Array<{ label: string, value: string }>
  };

  addSpecificationRow(targetForm: 'new' | 'edit'): void {
    if (targetForm === 'new') {
      if (!this.newProduct.specifications) this.newProduct.specifications = [];
      this.newProduct.specifications.push({ label: '', value: '' });
    } else if (this.editingProduct) {
      if (!this.editingProduct.specifications) this.editingProduct.specifications = [];
      this.editingProduct.specifications.push({ label: '', value: '' });
    }
  }

  removeSpecificationRow(targetForm: 'new' | 'edit', index: number): void {
    if (targetForm === 'new' && this.newProduct.specifications) {
      this.newProduct.specifications.splice(index, 1);
    } else if (this.editingProduct && this.editingProduct.specifications) {
      this.editingProduct.specifications.splice(index, 1);
    }
  }

  mockOrders: any[] = [];

  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  toastTimeout: any = null;

  private mockDataService = inject(MockDataService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.cdr.detectChanges();

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = '';
      this.cdr.detectChanges();
    }, 4000);
  }

  ngOnInit(): void {
    this.adminUser = this.authService.currentUser();
    if (this.adminUser) {
      this.profileForm.name = this.adminUser.name || 'Admin User';
      this.profileForm.email = this.adminUser.email || '';
    }

    this.loadAdminUsers();

    this.mockDataService.getProducts().subscribe(prods => {
      this.products = prods.map(p => {
        let img = p.image ? p.image.trim() : '';
        if (img && !img.startsWith('http') && !img.startsWith('data:') && !img.startsWith('/')) {
          img = '/' + img;
        }
        return {
          ...p,
          image: img || this.defaultImage
        };
      });
      this.cdr.detectChanges();
    });

    this.mockDataService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.cdr.detectChanges();
    });
  }

  openLogoutModal(): void {
    this.showLogoutModal = true;
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  confirmLogout(): void {
    this.showLogoutModal = false;
    this.authService.logout();
    this.cartService.clearCart();
    this.router.navigate(['/admin/login']);
  }

  onLogout(): void {
    this.openLogoutModal();
  }

  onTableImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = this.defaultImage;
    }
  }

  onPreviewImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = this.defaultImage;
    }
  }

  onDropdownImageSelect(event: Event, targetForm: 'new' | 'edit', fileInputEl: HTMLInputElement): void {
    const select = event.target as HTMLSelectElement;
    if (select.value === 'UPLOAD_SYSTEM') {
      fileInputEl.click();
    }
  }

  onFileSelected(event: Event, targetForm: 'new' | 'edit'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const fileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (targetForm === 'new') {
          this.newProduct.image = result;
          this.newSystemFileName = fileName;
          if (!this.newProduct.images) this.newProduct.images = [];
          if (!this.newProduct.images.includes(result)) {
            this.newProduct.images.unshift(result);
          }
        } else if (this.editingProduct) {
          this.editingProduct.image = result;
          this.editSystemFileName = fileName;
          if (!this.editingProduct.images) this.editingProduct.images = [];
          if (!this.editingProduct.images.includes(result)) {
            this.editingProduct.images.unshift(result);
          }
        }
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  onMultipleFilesSelected(event: Event, targetForm: 'new' | 'edit'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const filesArr = Array.from(input.files);
      filesArr.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (targetForm === 'new') {
            if (!this.newProduct.images) this.newProduct.images = [];
            this.newProduct.images.push(result);
            if (!this.newProduct.image || this.newProduct.image === '/assets/images/placeholder-rings.svg') {
              this.newProduct.image = result;
            }
          } else if (this.editingProduct) {
            if (!this.editingProduct.images) this.editingProduct.images = [];
            this.editingProduct.images.push(result);
            if (!this.editingProduct.image || this.editingProduct.image === '/assets/images/placeholder-rings.svg') {
              this.editingProduct.image = result;
            }
          }
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      });
      input.value = '';
    }
  }

  addImageUrl(targetForm: 'new' | 'edit', url: string): void {
    if (!url || url.trim() === '') return;
    const cleanUrl = url.trim();
    if (targetForm === 'new') {
      if (!this.newProduct.images) this.newProduct.images = [];
      this.newProduct.images.push(cleanUrl);
      if (!this.newProduct.image || this.newProduct.image === '/assets/images/placeholder-rings.svg') {
        this.newProduct.image = cleanUrl;
      }
    } else if (this.editingProduct) {
      if (!this.editingProduct.images) this.editingProduct.images = [];
      this.editingProduct.images.push(cleanUrl);
      if (!this.editingProduct.image || this.editingProduct.image === '/assets/images/placeholder-rings.svg') {
        this.editingProduct.image = cleanUrl;
      }
    }
    this.cdr.detectChanges();
  }

  removeProductImage(targetForm: 'new' | 'edit', index: number): void {
    if (targetForm === 'new' && this.newProduct.images) {
      this.newProduct.images.splice(index, 1);
      if (this.newProduct.images.length > 0) {
        this.newProduct.image = this.newProduct.images[0];
      } else {
        this.newProduct.image = '/assets/images/placeholder-rings.svg';
      }
    } else if (this.editingProduct && this.editingProduct.images) {
      this.editingProduct.images.splice(index, 1);
      if (this.editingProduct.images.length > 0) {
        this.editingProduct.image = this.editingProduct.images[0];
      } else {
        this.editingProduct.image = '/assets/images/placeholder-rings.svg';
      }
    }
    this.cdr.detectChanges();
  }

  setPrimaryProductImage(targetForm: 'new' | 'edit', index: number): void {
    if (targetForm === 'new' && this.newProduct.images) {
      const selected = this.newProduct.images.splice(index, 1)[0];
      this.newProduct.images.unshift(selected);
      this.newProduct.image = selected;
    } else if (this.editingProduct && this.editingProduct.images) {
      const selected = this.editingProduct.images.splice(index, 1)[0];
      this.editingProduct.images.unshift(selected);
      this.editingProduct.image = selected;
    }
    this.cdr.detectChanges();
  }

  moveProductImage(targetForm: 'new' | 'edit', index: number, direction: 'left' | 'right'): void {
    const list = targetForm === 'new' ? this.newProduct.images : (this.editingProduct ? this.editingProduct.images : null);
    if (!list) return;
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < list.length) {
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;
      if (targetForm === 'new') this.newProduct.image = list[0];
      if (this.editingProduct) this.editingProduct.image = list[0];
    }
    this.cdr.detectChanges();
  }

  clearSystemFile(targetForm: 'new' | 'edit'): void {
    if (targetForm === 'new') {
      this.newSystemFileName = '';
      this.newProduct.image = '/assets/images/placeholder-rings.svg';
    } else if (this.editingProduct) {
      this.editSystemFileName = '';
      this.editingProduct.image = '/assets/images/placeholder-rings.svg';
    }
  }

  isDataUrl(url?: string): boolean {
    return !!url && url.startsWith('data:');
  }

  editProduct(product: any): void {
    let img = product.image ? product.image.trim() : '';
    if (img && !img.startsWith('http') && !img.startsWith('data:') && !img.startsWith('/')) {
      img = '/' + img;
    }

    let rawList: string[] = Array.isArray(product.images) && product.images.length > 0
      ? [...product.images]
      : (img ? [img] : []);

    let imagesList: string[] = rawList.map(url => {
      let u = url ? url.trim() : '';
      if (u && !u.startsWith('http') && !u.startsWith('data:') && !u.startsWith('/')) {
        u = '/' + u;
      }
      return u;
    }).filter(u => u !== '');

    if (imagesList.length === 0 && img) {
      imagesList = [img];
    }

    let matsStr = '';
    if (Array.isArray(product.materials)) {
      matsStr = product.materials.join(', ');
    } else if (typeof product.materials === 'string') {
      matsStr = product.materials;
    } else {
      matsStr = '18K Warm Gold, Sterling Silver, Rose Gold';
    }

    let specsList: Array<{ label: string, value: string }> = [];
    if (Array.isArray(product.specifications) && product.specifications.length > 0) {
      specsList = product.specifications.map((s: any) => ({
        label: s.label || s.spec_label || '',
        value: s.value || s.spec_value || ''
      }));
    } else {
      specsList = [
        { label: 'Craftsmanship', value: 'Handcrafted Atelier Finish' },
        { label: 'Certification', value: 'BIS Hallmarked Gold' }
      ];
    }

    this.editingProduct = {
      id: product.id,
      name: product.name,
      category: product.category || (this.categories.length > 0 ? this.categories[0].name : ''),
      price: product.price,
      compareAtPrice: product.compareAtPrice || null,
      badge: product.badge || '',
      image: img || (imagesList.length > 0 ? imagesList[0] : ''),
      images: imagesList,
      stockQuantity: product.stockQuantity !== undefined && product.stockQuantity !== null ? product.stockQuantity : 0,
      description: product.description || '',
      materialsStr: matsStr,
      careGuide: product.careGuide || product.care_guide || 'Handle with care. Store in protective velvet pouch after use.',
      shippingInfo: product.shippingInfo || product.shipping_info || 'Complimentary insured express delivery within 3-5 business days.',
      specifications: specsList
    };
    this.editSuccessMessage = '';
    this.editSystemFileName = '';
  }

  closeEditModal(): void {
    this.editingProduct = null;
    this.editSuccessMessage = '';
    this.editSystemFileName = '';
  }

  async updateProduct(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.editingProduct) return;

    if (!this.editingProduct.name || !this.editingProduct.name.trim()) {
      this.showToast('Product Name is mandatory.', 'error');
      return;
    }
    if (!this.editingProduct.category || !this.editingProduct.category.trim()) {
      this.showToast('Category selection is mandatory.', 'error');
      return;
    }
    if (!this.editingProduct.price || Number(this.editingProduct.price) <= 0) {
      this.showToast('Valid Product Price is mandatory.', 'error');
      return;
    }
    if (this.editingProduct.stockQuantity === '' || this.editingProduct.stockQuantity === null || this.editingProduct.stockQuantity === undefined || Number(this.editingProduct.stockQuantity) < 0) {
      this.showToast('Stock Quantity is mandatory.', 'error');
      return;
    }
    const hasImage = (this.editingProduct.image && this.editingProduct.image.trim() !== '') || (this.editingProduct.images && this.editingProduct.images.length > 0);
    if (!hasImage) {
      this.showToast('Product Image is mandatory.', 'error');
      return;
    }
    if (!this.editingProduct.description || !this.editingProduct.description.trim()) {
      this.showToast('Product Description is mandatory.', 'error');
      return;
    }

    let finalImage = this.editingProduct.image && this.editingProduct.image.trim() !== ''
      ? this.editingProduct.image.trim()
      : this.defaultImage;

    if (!finalImage.startsWith('http') && !finalImage.startsWith('data:') && !finalImage.startsWith('/')) {
      finalImage = '/' + finalImage;
    }

    const imagesList = this.editingProduct.images && this.editingProduct.images.length > 0
      ? this.editingProduct.images
      : [finalImage];

    const materialsArray = (this.editingProduct.materialsStr || '')
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s !== '');

    const validSpecs = (this.editingProduct.specifications || [])
      .filter((s: any) => s.label && s.label.trim() !== '' && s.value && s.value.trim() !== '');

    const payload = {
      ...this.editingProduct,
      name: this.editingProduct.name.trim(),
      price: Number(this.editingProduct.price),
      stockQuantity: Number(this.editingProduct.stockQuantity) || 0,
      description: this.editingProduct.description ? this.editingProduct.description.trim() : '',
      image: finalImage,
      images: imagesList,
      materials: materialsArray,
      careGuide: this.editingProduct.careGuide || '',
      shippingInfo: this.editingProduct.shippingInfo || '',
      specifications: validSpecs
    };

    let notificationMsg = `Product ID ${this.editingProduct.id} updated successfully.`;
    let isSuccess = true;

    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN.PRODUCT_BY_ID(this.editingProduct.id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.message) {
        notificationMsg = data.message;
      }
      isSuccess = res.ok && (data.success !== false);
    } catch (err) {
      // Offline fallback
    }

    // Sync product update with MockDataService
    this.mockDataService.updateProduct(this.editingProduct.id, {
      name: this.editingProduct.name.trim(),
      category: this.editingProduct.category,
      price: Number(this.editingProduct.price),
      compareAtPrice: this.editingProduct.compareAtPrice ? Number(this.editingProduct.compareAtPrice) : undefined,
      badge: (this.editingProduct.badge as any) || undefined,
      image: finalImage,
      images: imagesList,
      stockQuantity: Number(this.editingProduct.stockQuantity) || 0,
      description: this.editingProduct.description ? this.editingProduct.description.trim() : '',
      materials: materialsArray,
      careGuide: this.editingProduct.careGuide || '',
      shippingInfo: this.editingProduct.shippingInfo || '',
      specifications: validSpecs
    });

    // Update product in local state
    const index = this.products.findIndex(p => p.id === this.editingProduct.id);
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        name: this.editingProduct.name.trim(),
        category: this.editingProduct.category,
        price: Number(this.editingProduct.price),
        compareAtPrice: this.editingProduct.compareAtPrice ? Number(this.editingProduct.compareAtPrice) : undefined,
        badge: (this.editingProduct.badge as any) || undefined,
        image: finalImage,
        images: imagesList
      };
    }

    // CLOSE POPUP MODAL IMMEDIATELY
    this.closeEditModal();

    // SHOW API RESPONSE AS TOAST NOTIFICATION
    this.showToast(notificationMsg, isSuccess ? 'success' : 'error');
  }

  async saveProduct(event: Event): Promise<void> {
    event.preventDefault();

    if (!this.newProduct.name || !this.newProduct.name.trim()) {
      this.showToast('Product Name is mandatory.', 'error');
      return;
    }
    if (!this.newProduct.category || !this.newProduct.category.trim()) {
      this.showToast('Category selection is mandatory.', 'error');
      return;
    }
    if (!this.newProduct.price || Number(this.newProduct.price) <= 0) {
      this.showToast('Valid Product Price is mandatory.', 'error');
      return;
    }
    if (this.newProduct.stockQuantity === '' || this.newProduct.stockQuantity === null || this.newProduct.stockQuantity === undefined || Number(this.newProduct.stockQuantity) < 0) {
      this.showToast('Stock Quantity is mandatory.', 'error');
      return;
    }
    const hasImage = (this.newProduct.image && this.newProduct.image.trim() !== '') || (this.newProduct.images && this.newProduct.images.length > 0);
    if (!hasImage) {
      this.showToast('Product Image is mandatory.', 'error');
      return;
    }
    if (!this.newProduct.description || !this.newProduct.description.trim()) {
      this.showToast('Product Description is mandatory.', 'error');
      return;
    }

    let finalImage = this.newProduct.image && this.newProduct.image.trim() !== ''
      ? this.newProduct.image.trim()
      : (this.newProduct.images && this.newProduct.images.length > 0 ? this.newProduct.images[0] : this.defaultImage);

    if (!finalImage.startsWith('http') && !finalImage.startsWith('data:') && !finalImage.startsWith('/')) {
      finalImage = '/' + finalImage;
    }

    const imagesList = this.newProduct.images && this.newProduct.images.length > 0
      ? this.newProduct.images
      : [finalImage];

    const materialsArray = (this.newProduct.materialsStr || '')
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s !== '');

    const validSpecs = (this.newProduct.specifications || [])
      .filter((s: any) => s.label && s.label.trim() !== '' && s.value && s.value.trim() !== '');

    const payload = {
      ...this.newProduct,
      name: this.newProduct.name.trim(),
      price: Number(this.newProduct.price),
      stockQuantity: Number(this.newProduct.stockQuantity) || 0,
      description: this.newProduct.description.trim(),
      image: finalImage,
      images: imagesList,
      materials: materialsArray,
      careGuide: this.newProduct.careGuide || '',
      shippingInfo: this.newProduct.shippingInfo || '',
      specifications: validSpecs
    };

    let createdProductId: any = null;
    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN.PRODUCTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.data && data.data.id) {
        createdProductId = data.data.id;
      }
    } catch (err) {
      // Offline fallback
    }

    const createdMockProduct = this.mockDataService.addProduct({
      id: createdProductId || undefined,
      name: this.newProduct.name.trim(),
      category: this.newProduct.category,
      price: Number(this.newProduct.price),
      compareAtPrice: this.newProduct.compareAtPrice ? Number(this.newProduct.compareAtPrice) : undefined,
      badge: (this.newProduct.badge as 'NEW' | 'SALE' | 'FEATURED' | 'BESTSELLER') || undefined,
      image: finalImage,
      images: imagesList,
      stockQuantity: Number(this.newProduct.stockQuantity) || 0,
      description: this.newProduct.description.trim(),
      materials: materialsArray,
      careGuide: this.newProduct.careGuide || '',
      shippingInfo: this.newProduct.shippingInfo || '',
      specifications: validSpecs
    });

    const createdItem: ProductCardData = {
      id: createdMockProduct.id,
      name: createdMockProduct.name,
      slug: createdMockProduct.slug,
      category: createdMockProduct.category,
      price: createdMockProduct.price,
      compareAtPrice: createdMockProduct.compareAtPrice,
      badge: createdMockProduct.badge,
      image: createdMockProduct.image,
      images: imagesList,
      available: true
    };

    this.products = [createdItem, ...this.products];
    const createdName = this.newProduct.name;

    this.closeAddProductModal();
    this.showToast(`Jewellery creation "${createdName}" published to catalog!`, 'success');
  }

  async onUpdateProfile(event: Event): Promise<void> {
    event.preventDefault();
    this.profileSuccessMessage = '';
    this.profileErrorMessage = '';

    const res = await this.authService.updateAdminProfile(
      this.profileForm.name,
      this.profileForm.email,
      this.profileForm.newPassword
    );

    if (res.success) {
      this.profileSuccessMessage = res.message;
      this.adminUser = this.authService.currentUser();
      this.profileForm.newPassword = '';
    } else {
      this.profileErrorMessage = res.message;
    }
  }

  showCreateAdminModal: boolean = false;
  showUpdatePasswordModal: boolean = false;
  editingAdminUser: any = null;
  newPasswordInput: string = '';
  showNewPasswordInputText: boolean = false;
  updatePasswordErrorMessage: string = '';

  async loadAdminUsers(): Promise<void> {
    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN.USERS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        this.createdAdminUsers = data.data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role || 'ADMIN',
          createdAt: u.createdAt || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'ACTIVE'
        }));
        this.cdr.detectChanges();
        return;
      }
    } catch (err) {
      // Fallback
    }

    const savedAdmins = localStorage.getItem('arista_created_admins');
    if (savedAdmins) {
      try {
        this.createdAdminUsers = JSON.parse(savedAdmins);
      } catch {
        this.createdAdminUsers = [];
      }
    }
  }

  async onCreateAdmin(event: Event): Promise<void> {
    event.preventDefault();
    this.newAdminErrorMessage = '';

    if (!this.newAdminForm.name || !this.newAdminForm.email || !this.newAdminForm.password) {
      this.newAdminErrorMessage = 'Please fill in all required fields (Name, Email, Password).';
      return;
    }

    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN.USERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(this.newAdminForm)
      });
      const data = await res.json();

      if (data.success) {
        this.showToast(data.message || 'New Admin user registered successfully!', 'success');
        this.newAdminForm = { name: '', email: '', password: '' };
        this.showCreateAdminModal = false;
        this.loadAdminUsers();
        return;
      } else {
        this.newAdminErrorMessage = data.message || 'Failed to create admin user.';
      }
    } catch (err) {
      this.newAdminErrorMessage = 'Failed to connect to backend server.';
    }
  }

  openUpdatePasswordModal(user: any): void {
    this.editingAdminUser = user;
    this.newPasswordInput = '';
    this.updatePasswordErrorMessage = '';
    this.showUpdatePasswordModal = true;
    this.cdr.detectChanges();
  }

  closeUpdatePasswordModal(): void {
    this.showUpdatePasswordModal = false;
    this.editingAdminUser = null;
    this.newPasswordInput = '';
    this.cdr.detectChanges();
  }

  async onUpdateAdminPassword(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.editingAdminUser || !this.newPasswordInput || this.newPasswordInput.trim().length < 4) {
      this.updatePasswordErrorMessage = 'Password must be at least 4 characters long.';
      this.cdr.detectChanges();
      return;
    }

    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN.USER_PASSWORD(this.editingAdminUser.id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          password: this.newPasswordInput.trim(),
          email: this.editingAdminUser.email,
          name: this.editingAdminUser.name
        })
      });
      const data = await res.json();
      if (data.success) {
        this.showToast(`Password updated successfully for admin "${this.editingAdminUser.name}"!`, 'success');
        this.closeUpdatePasswordModal();
        return;
      } else {
        this.updatePasswordErrorMessage = data.message || 'Failed to update password.';
      }
    } catch (err) {
      this.updatePasswordErrorMessage = 'Failed to connect to backend server.';
    }
    this.cdr.detectChanges();
  }

  async deleteAdminUser(adminId: number): Promise<void> {
    const adminObj = this.createdAdminUsers.find(a => a.id === adminId);
    const adminName = adminObj ? adminObj.name : `Admin #${adminId}`;

    try {
      const token = this.authService.getToken();
      await fetch(API_ENDPOINTS.ADMIN.USER_BY_ID(adminId), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      // Fallback
    }

    this.createdAdminUsers = this.createdAdminUsers.filter(a => a.id !== adminId);
    localStorage.setItem('arista_created_admins', JSON.stringify(this.createdAdminUsers));
    this.showToast(`Admin user account "${adminName}" revoked and removed.`, 'success');
    this.loadAdminUsers();
  }

  promptDeleteProduct(product: ProductCardData): void {
    this.deleteTarget = {
      type: 'product',
      id: product.id,
      name: product.name
    };
    this.cdr.detectChanges();
  }

  promptDeleteCategory(category: Category): void {
    this.deleteTarget = {
      type: 'category',
      id: category.id,
      name: category.name
    };
    this.cdr.detectChanges();
  }

  promptDeleteAdminUser(admin: any): void {
    this.deleteTarget = {
      type: 'user',
      id: admin.id,
      name: admin.name || admin.email
    };
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.deleteTarget = null;
    this.cdr.detectChanges();
  }

  async confirmDelete(): Promise<void> {
    if (!this.deleteTarget) return;

    const { type, id, name } = this.deleteTarget;
    this.deleteTarget = null;
    const targetStr = String(id);

    if (type === 'product') {
      try {
        const token = this.authService.getToken();
        await fetch(API_ENDPOINTS.ADMIN.PRODUCT_BY_ID(id), {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (err) {
        // Offline fallback
      }

      this.products = this.products.filter(p => String(p.id) !== targetStr);
      this.mockDataService.deleteProduct(id);
      this.showToast(`Jewellery product "${name}" deleted from catalog.`, 'success');
      this.cdr.detectChanges();
    } else if (type === 'category') {
      try {
        const token = this.authService.getToken();
        await fetch(API_ENDPOINTS.ADMIN.CATEGORY_BY_ID(id), {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (err) {
        // Offline fallback
      }

      this.categories = this.categories.filter(c => String(c.id) !== targetStr && c.slug !== targetStr);
      this.mockDataService.deleteCategory(id);
      this.showToast(`Category "${name}" removed from catalog.`, 'success');
      this.cdr.detectChanges();
    } else if (type === 'user') {
      try {
        const token = this.authService.getToken();
        await fetch(API_ENDPOINTS.ADMIN.USER_BY_ID(id), {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (err) {
        // Offline fallback
      }

      this.createdAdminUsers = this.createdAdminUsers.filter(a => String(a.id) !== targetStr);
      localStorage.setItem('arista_created_admins', JSON.stringify(this.createdAdminUsers));
      this.showToast(`Admin user account "${name}" revoked and removed.`, 'success');
      this.loadAdminUsers();
    }
  }

  updateOrderStatus(order: any, event: Event): void {
    const select = event.target as HTMLSelectElement;
    order.status = select.value;
  }

  onCategoryNameChange(name: string): void {
    this.newCategory.name = name;
    if (name) {
      this.newCategory.slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
  }

  onCategoryPosterPresetSelect(event: Event, fileInputEl: HTMLInputElement): void {
    const select = event.target as HTMLSelectElement;
    if (select.value === 'UPLOAD_SYSTEM') {
      fileInputEl.click();
    } else if (select.value) {
      this.newCategory.image = select.value;
      this.newCategoryFileName = '';
    }
  }

  onCategoryFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.newCategoryFileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newCategory.image = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async onAddCategory(event: Event): Promise<void> {
    event.preventDefault();
    this.categoryErrorMessage = '';
    this.categorySuccessMessage = '';

    if (!this.newCategory.name || !this.newCategory.name.trim()) {
      this.categoryErrorMessage = 'Category Name is mandatory.';
      return;
    }
    if (!this.newCategory.slug || !this.newCategory.slug.trim()) {
      this.categoryErrorMessage = 'Category Slug is mandatory.';
      return;
    }
    if (!this.newCategory.image || !this.newCategory.image.trim()) {
      this.categoryErrorMessage = 'Category Image is mandatory.';
      return;
    }
    if (!this.newCategory.description || !this.newCategory.description.trim()) {
      this.categoryErrorMessage = 'Category Description is mandatory.';
      return;
    }

    const inputNameLower = this.newCategory.name.trim().toLowerCase();
    const inputSlugLower = this.newCategory.slug.trim().toLowerCase();

    const isDuplicate = this.categories.some(c =>
      c.name.trim().toLowerCase() === inputNameLower ||
      c.slug.trim().toLowerCase() === inputSlugLower
    );

    if (isDuplicate) {
      const errMsg = `Category "${this.newCategory.name.trim()}" already exists. Cannot add duplicate categories.`;
      this.categoryErrorMessage = errMsg;
      return;
    }

    const payload = {
      name: this.newCategory.name.trim(),
      slug: this.newCategory.slug.trim(),
      description: this.newCategory.description.trim(),
      image: this.newCategory.image.trim()
    };

    let createdCatId: any = null;
    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN.CATEGORIES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || (data && data.success === false)) {
        const errMsg = data?.message || `Category "${this.newCategory.name.trim()}" already exists.`;
        this.categoryErrorMessage = errMsg;
        return;
      }
      if (data && data.data && data.data.id) {
        createdCatId = data.data.id;
      }
    } catch (err) {
      // Offline fallback
    }

    try {
      const added = this.mockDataService.addCategory({
        ...payload,
        id: createdCatId || undefined,
        featured: true
      });

      const catName = added.name;
      this.closeAddCategoryModal();
      this.showToast(`Category "${catName}" published successfully!`, 'success');
    } catch (err: any) {
      const errMsg = err.message || `Category "${this.newCategory.name.trim()}" already exists.`;
      this.categoryErrorMessage = errMsg;
    }
  }

  openAddCategoryModal(): void {
    this.resetAddCategoryForm();
    this.showAddCategoryModal = true;
  }

  closeAddCategoryModal(): void {
    this.showAddCategoryModal = false;
    this.resetAddCategoryForm();
  }

  resetAddCategoryForm(): void {
    this.newCategory = {
      name: '',
      slug: '',
      description: '',
      image: ''
    };
    this.newCategoryFileName = '';
    this.categoryErrorMessage = '';
    this.categorySuccessMessage = '';
  }

  openAddProductModal(): void {
    this.resetAddProductForm();
    this.showAddProductModal = true;
  }

  closeAddProductModal(): void {
    this.showAddProductModal = false;
    this.resetAddProductForm();
  }

  resetAddProductForm(): void {
    this.newProduct = {
      name: '',
      category: '',
      price: '',
      compareAtPrice: '',
      badge: 'NEW',
      stockQuantity: '',
      image: '',
      images: [],
      description: '',
      materialsStr: '18K Warm Gold, Sterling Silver, Rose Gold',
      careGuide: 'Handle with care. Store in protective velvet pouch after use.',
      shippingInfo: 'Complimentary insured express delivery within 3-5 business days.',
      specifications: [
        { label: 'Craftsmanship', value: 'Handcrafted Atelier Finish' },
        { label: 'Certification', value: 'BIS Hallmarked Gold' }
      ]
    };
    this.newSystemFileName = '';
    this.successMessage = '';
  }

  openCreateAdminModal(): void {
    this.resetCreateAdminForm();
    this.showCreateAdminModal = true;
  }

  closeCreateAdminModal(): void {
    this.showCreateAdminModal = false;
    this.resetCreateAdminForm();
  }

  resetCreateAdminForm(): void {
    this.newAdminForm = { name: '', email: '', password: '' };
    this.newAdminErrorMessage = '';
  }

  async deleteCategory(id: number | string): Promise<void> {
    const cat = this.categories.find(c => c.id === id);
    const name = cat ? cat.name : `ID ${id}`;

    try {
      const token = this.authService.getToken();
      await fetch(API_ENDPOINTS.ADMIN.CATEGORY_BY_ID(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      // Offline fallback
    }

    this.mockDataService.deleteCategory(id);
    this.categories = this.categories.filter(c => c.id !== id);
    this.showToast(`Category "${name}" removed from catalog.`, 'success');
  }

  editCategory(category: Category): void {
    this.editingCategory = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      featured: category.featured !== undefined ? category.featured : true
    };
    this.editCategoryFileName = '';
    this.editCategorySuccessMessage = '';
  }

  closeEditCategoryModal(): void {
    this.editingCategory = null;
    this.editCategoryFileName = '';
    this.editCategorySuccessMessage = '';
  }

  onEditCategoryNameChange(name: string): void {
    if (this.editingCategory) {
      this.editingCategory.name = name;
      if (name) {
        this.editingCategory.slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
    }
  }

  onEditCategoryPosterPresetSelect(event: Event, fileInputEl: HTMLInputElement): void {
    const select = event.target as HTMLSelectElement;
    if (select.value === 'UPLOAD_SYSTEM') {
      fileInputEl.click();
    } else if (select.value && this.editingCategory) {
      this.editingCategory.image = select.value;
      this.editCategoryFileName = '';
    }
  }

  onEditCategoryFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.editingCategory) {
      const file = input.files[0];
      this.editCategoryFileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.editingCategory.image = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async updateCategory(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.editingCategory) return;

    if (!this.editingCategory.name || !this.editingCategory.name.trim()) {
      this.showToast('Category Name is mandatory.', 'error');
      return;
    }
    if (!this.editingCategory.slug || !this.editingCategory.slug.trim()) {
      this.showToast('Category Slug is mandatory.', 'error');
      return;
    }
    if (!this.editingCategory.image || !this.editingCategory.image.trim()) {
      this.showToast('Category Image is mandatory.', 'error');
      return;
    }
    if (!this.editingCategory.description || !this.editingCategory.description.trim()) {
      this.showToast('Category Description is mandatory.', 'error');
      return;
    }

    const editNameLower = this.editingCategory.name.trim().toLowerCase();
    const editSlugLower = this.editingCategory.slug.trim().toLowerCase();

    const isDuplicate = this.categories.some(c =>
      c.id !== this.editingCategory.id &&
      (c.name.trim().toLowerCase() === editNameLower || c.slug.trim().toLowerCase() === editSlugLower)
    );

    if (isDuplicate) {
      const errMsg = `Category "${this.editingCategory.name.trim()}" already exists. Cannot update with duplicate name or slug.`;
      this.showToast(errMsg, 'error');
      return;
    }

    const payload = {
      name: this.editingCategory.name.trim(),
      slug: this.editingCategory.slug.trim(),
      description: this.editingCategory.description.trim(),
      image: this.editingCategory.image,
      featured: this.editingCategory.featured
    };

    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN.CATEGORY_BY_ID(this.editingCategory.id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || (data && data.success === false)) {
        const errMsg = data?.message || 'Category update failed.';
        this.showToast(errMsg, 'error');
        return;
      }
    } catch (err) {
      // Offline fallback
    }

    this.mockDataService.updateCategory(this.editingCategory.id, payload);

    const idx = this.categories.findIndex(c => c.id === this.editingCategory.id);
    if (idx !== -1) {
      this.categories[idx] = {
        ...this.categories[idx],
        ...payload
      };
    }

    const name = this.editingCategory.name;
    this.closeEditCategoryModal();
    this.showToast(`Category "${name}" updated successfully!`, 'success');
  }

  clearCategoryFile(targetForm: 'new' | 'edit'): void {
    if (targetForm === 'new') {
      this.newCategoryFileName = '';
      this.newCategory.image = getDefaultCategoryImage(this.newCategory.name);
    } else if (this.editingCategory) {
      this.editCategoryFileName = '';
      this.editingCategory.image = getDefaultCategoryImage(this.editingCategory.name);
    }
  }
}
