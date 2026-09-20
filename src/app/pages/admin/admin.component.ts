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
            <span class="metric-value">12</span>
            <span class="metric-sub">+3 Orders Today</span>
          </div>

          <div class="metric-card warning">
            <span class="metric-label">Low Stock Items</span>
            <span class="metric-value">1</span>
            <span class="metric-sub">Action Required</span>
          </div>
        </div>

        <!-- Admin Tab Controls -->
        <div class="admin-tabs">
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
            [class.active]="activeTab === 'categories'"
            (click)="activeTab = 'categories'"
          >
            Categories ({{ categories.length }})
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'orders'"
            (click)="activeTab = 'orders'"
          >
            Customer Orders (12)
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

        <!-- TAB 1: PRODUCT CATALOG TABLE -->
        <div *ngIf="activeTab === 'products'" class="tab-content">
          <div class="tab-action-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-family: var(--font-serif); color: var(--brand-mocha-brown); margin: 0; font-size: 1.2rem;">Product Catalog ({{ products.length }})</h3>
            <button type="button" class="btn-save" style="margin-top: 0; padding: 10px 22px;" (click)="showAddProductModal = true">
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
                    <span class="stock-pill in-stock" *ngIf="item.inStock !== false">In Stock (10)</span>
                    <span class="stock-pill out-stock" *ngIf="item.inStock === false">Out of Stock</span>
                  </td>
                  <td>
                    <div class="action-btns">
                      <button type="button" class="btn-action edit" (click)="editProduct(item)">Edit Product</button>
                      <button type="button" class="btn-action delete" (click)="deleteProduct(item.id)">Delete</button>
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
          <div class="credentials-grid">
            <!-- SECTION 1: UPDATE YOUR CREDENTIALS -->
            <div class="form-card">
              <h2 class="form-title">Update Your Admin Profile & Credentials</h2>
              <div class="success-banner" *ngIf="profileSuccessMessage">
                ✓ {{ profileSuccessMessage }}
              </div>
              <div class="error-banner" *ngIf="profileErrorMessage">
                ⚠ {{ profileErrorMessage }}
              </div>

              <form (submit)="onUpdateProfile($event)" class="product-form">
                <div class="form-group">
                  <label>Admin Full Name *</label>
                  <input type="text" [(ngModel)]="profileForm.name" name="profName" required />
                </div>

                <div class="form-group">
                  <label>Admin Email Address *</label>
                  <input type="email" [(ngModel)]="profileForm.email" name="profEmail" required />
                </div>

                <div class="form-group">
                  <label>New Secret Password (Leave blank to keep current)</label>
                  <div class="password-field-wrapper">
                    <input
                      [type]="showProfilePassword ? 'text' : 'password'"
                      [(ngModel)]="profileForm.newPassword"
                      name="profPassword"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      class="btn-toggle-eye"
                      (click)="showProfilePassword = !showProfilePassword"
                      [title]="showProfilePassword ? 'Hide Password' : 'Show Password'"
                    >
                      <svg *ngIf="!showProfilePassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <svg *ngIf="showProfilePassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    </button>
                  </div>
                </div>

                <button type="submit" class="btn-save">Save Profile Changes</button>
              </form>
            </div>

            <!-- SECTION 2: CREATE NEW ADMIN ACCOUNT & CREATED USER TABLE -->
            <div class="form-card">
              <div class="section-title-row">
                <h2 class="form-title" style="margin:0;">Create New Admin Account</h2>
                <span class="limit-badge" [class.reached]="createdAdminUsers.length >= 1">
                  Admin Limit: {{ createdAdminUsers.length }}/1 Accounts
                </span>
              </div>

              <div class="success-banner" *ngIf="newAdminSuccessMessage" style="margin-top:16px;">
                ✓ {{ newAdminSuccessMessage }}
              </div>
              <div class="error-banner" *ngIf="newAdminErrorMessage" style="margin-top:16px;">
                ⚠ {{ newAdminErrorMessage }}
              </div>

              <!-- Registration Form (Visible only if limit < 1) -->
              <form (submit)="onCreateAdmin($event)" class="product-form" style="margin-top: 16px;" *ngIf="createdAdminUsers.length < 1">
                <div class="form-group">
                  <label>New Admin Full Name *</label>
                  <input type="text" [(ngModel)]="newAdminForm.name" name="newAdminName" placeholder="e.g. Executive Director" required />
                </div>

                <div class="form-group">
                  <label>New Admin Email Address *</label>
                  <input type="email" [(ngModel)]="newAdminForm.email" name="newAdminEmail" placeholder="manager@aristatrinkets.com" required />
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

                <button type="submit" class="btn-save">+ Register New Admin User</button>
              </form>

              <div class="limit-reached-banner" *ngIf="createdAdminUsers.length >= 1" style="margin-top:16px;">
                <span>🔒 Maximum limit reached. Only 1 additional admin user account can be created and active.</span>
              </div>

              <!-- TABLE VIEW OF CREATED USER ADMIN -->
              <div class="created-admin-section" style="margin-top: 24px;" *ngIf="createdAdminUsers.length > 0">
                <h3 class="sub-table-title">Registered Secondary Admin Users ({{ createdAdminUsers.length }})</h3>
                <div class="table-responsive">
                  <table class="admin-table">
                    <thead>
                      <tr>
                        <th>Admin Name</th>
                        <th>Email Address</th>
                        <th>Assigned Role</th>
                        <th>Registration Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
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
                          <span class="stock-pill in-stock">{{ admin.status }}</span>
                        </td>
                        <td>
                          <button type="button" class="btn-action delete" (click)="deleteAdminUser(admin.id)">
                            Revoke / Remove
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB: CATEGORIES CATALOG TABLE -->
        <div *ngIf="activeTab === 'categories'" class="tab-content">
          <div class="tab-action-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-family: var(--font-serif); color: var(--brand-mocha-brown); margin: 0; font-size: 1.2rem;">Collection Categories ({{ categories.length }})</h3>
            <button type="button" class="btn-save" style="margin-top: 0; padding: 10px 22px;" (click)="showAddCategoryModal = true">
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
                      <button type="button" class="btn-action delete" (click)="deleteCategory(cat.id)">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
                <option value="Rings">Rings</option>
                <option value="Necklaces">Necklaces</option>
                <option value="Earrings">Earrings</option>
                <option value="Bracelets">Bracelets</option>
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

            <!-- File Upload & Add URL Row -->
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

              <div class="gallery-url-group">
                <input #editUrlInput type="text" placeholder="Or paste image URL (https://... or /assets/...)" class="gallery-url-input" />
                <button type="button" class="gallery-add-url-btn" (click)="addImageUrl('edit', editUrlInput.value); editUrlInput.value = ''">
                  + Add URL
                </button>
              </div>
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
    <div *ngIf="showAddProductModal" class="modal-backdrop" (click)="showAddProductModal = false">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="form-title" style="margin:0;">+ Add New Jewellery Creation to Catalog</h2>
          <button type="button" class="btn-close" (click)="showAddProductModal = false">&times;</button>
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

            <!-- File Upload & Add URL Row -->
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

              <div class="gallery-url-group">
                <input #newUrlInput type="text" placeholder="Or paste image URL (https://... or /assets/...)" class="gallery-url-input" />
                <button type="button" class="gallery-add-url-btn" (click)="addImageUrl('new', newUrlInput.value); newUrlInput.value = ''">
                  + Add URL
                </button>
              </div>
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
          </div>

          <div class="form-group">
            <label>Product Description & Atelier Craft Notes</label>
            <textarea rows="4" [(ngModel)]="newProduct.description" name="description" placeholder="Describe the gold karatage, diamond clarity, craftsmanship..."></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="showAddProductModal = false">Cancel</button>
            <button type="submit" class="btn-save" style="margin-top:0;">+ Publish Product to Storefront</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ADD CATEGORY MODAL OVERLAY POPUP -->
    <div *ngIf="showAddCategoryModal" class="modal-backdrop" (click)="showAddCategoryModal = false">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="form-title" style="margin:0;">+ Add New Collection Category</h2>
          <button type="button" class="btn-close" (click)="showAddCategoryModal = false">&times;</button>
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
          <div class="preview-box">
            <span class="preview-label">Storefront Poster Preview:</span>
            <div class="preview-img-container" style="aspect-ratio: 16/9; max-width: 380px;">
              <img
                [src]="newCategory.image || defaultImage"
                (error)="onPreviewImageError($event)"
                alt="Category Poster Preview"
                class="preview-img"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="showAddCategoryModal = false">Cancel</button>
            <button type="submit" class="btn-save" style="margin-top:0;">+ Publish Category to Storefront</button>
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
      padding: 14px 24px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      display: flex;
      align-items: center;
      gap: 12px;
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
    }

    .btn-close-toast {
      background: transparent;
      border: none;
      color: currentColor;
      font-size: 1.3rem;
      cursor: pointer;
      line-height: 1;
      padding: 0 4px;
      opacity: 0.8;
      transition: opacity var(--transition-fast);
    }
    .btn-close-toast:hover {
      opacity: 1;
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
      font-weight: 700;
      color: var(--brand-mocha-brown);
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .img-count-badge {
      background: var(--brand-warm-gold);
      color: #1A120B;
      font-size: 0.72rem;
      padding: 3px 10px;
      border-radius: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .gallery-upload-bar {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 14px;
    }

    .gallery-upload-btn {
      height: 38px;
      padding: 0 16px;
      border-radius: 6px;
      background: var(--brand-mocha-brown);
      color: #FFFFFF;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: none;
      white-space: nowrap;
      transition: all 0.2s ease;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .gallery-upload-btn:hover {
      background: #2D1E14;
      transform: translateY(-1px);
    }

    .gallery-url-group {
      display: flex;
      gap: 6px;
      flex: 1;
      min-width: 240px;
      height: 38px;
    }

    .gallery-url-input {
      flex: 1;
      height: 38px;
      border: 1px solid #D5C9BD;
      border-radius: 6px;
      padding: 0 12px;
      font-size: 0.82rem;
      outline: none;
      background: #FFFFFF;
      color: #333333;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .gallery-url-input:focus {
      border-color: var(--brand-warm-gold);
      box-shadow: 0 0 0 3px rgba(207, 168, 116, 0.18);
    }

    .gallery-add-url-btn {
      height: 38px;
      padding: 0 16px;
      border-radius: 6px;
      background: var(--brand-warm-gold);
      color: #1A120B;
      font-size: 0.8rem;
      font-weight: 700;
      border: none;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .gallery-add-url-btn:hover {
      background: #B8925E;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }

    .gallery-thumb-card {
      position: relative;
      border: 1px solid #E2D9CF;
      border-radius: 8px;
      overflow: hidden;
      background: #FFFFFF;
      padding: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .gallery-thumb-card:hover {
      border-color: var(--brand-warm-gold);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .thumb-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      font-size: 0.62rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      z-index: 3;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1;
    }
    .thumb-badge.main {
      background: var(--brand-warm-gold);
      color: #1A120B;
      box-shadow: 0 1px 4px rgba(0,0,0,0.25);
    }
    .thumb-badge.secondary {
      background: rgba(26, 18, 11, 0.7);
      color: #FFFFFF;
      backdrop-filter: blur(2px);
    }

    .thumb-delete-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(220, 53, 69, 0.88);
      color: #FFFFFF;
      border: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 4;
      line-height: 1;
      padding: 0;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
      transition: all 0.2s ease;
    }
    .thumb-delete-btn:hover {
      background: #DC3545;
      transform: scale(1.15);
    }

    .thumb-img {
      width: 100%;
      height: 80px;
      object-fit: cover;
      border-radius: 6px;
      display: block;
      background: #F7F5F2;
    }

    .thumb-card-actions {
      display: flex;
      gap: 4px;
      margin-top: 6px;
      width: 100%;
      justify-content: center;
      align-items: center;
      height: 24px;
    }

    .pill-btn-main {
      flex: 1;
      font-size: 0.65rem;
      font-weight: 600;
      background: rgba(207, 168, 116, 0.15);
      color: #5B4636;
      border: 1px solid rgba(207, 168, 116, 0.4);
      border-radius: 4px;
      padding: 0 4px;
      cursor: pointer;
      height: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .pill-btn-main:hover {
      background: var(--brand-warm-gold);
      color: #1A120B;
      border-color: var(--brand-warm-gold);
    }

    .pill-btn-nav {
      width: 22px;
      height: 22px;
      font-size: 0.75rem;
      font-weight: 700;
      background: #F7F5F2;
      color: #5B4636;
      border: 1px solid #E2D9CF;
      border-radius: 4px;
      padding: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      transition: all 0.15s ease;
    }
    .pill-btn-nav:hover {
      background: var(--brand-mocha-brown);
      color: #FFFFFF;
      border-color: var(--brand-mocha-brown);
    }

    .primary-cover-label {
      flex: 1;
      font-size: 0.62rem;
      font-weight: 700;
      color: #8C6A3C;
      text-align: center;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      line-height: 22px;
    }
  `]
})
export class AdminComponent implements OnInit {
  defaultImage = DEFAULT_FALLBACK_IMAGE;
  activeTab: 'products' | 'add-product' | 'categories' | 'add-category' | 'orders' | 'credentials' = 'products';
  products: ProductCardData[] = [];
  categories: Category[] = [];
  successMessage: string = '';

  showAddProductModal: boolean = false;
  showAddCategoryModal: boolean = false;

  adminUser: any = null;
  showLogoutModal: boolean = false;

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
    image: '/assets/images/hero-categories.jpg'
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
    category: 'Rings',
    price: 45000,
    compareAtPrice: 52000,
    badge: 'NEW',
    stockQuantity: 10,
    image: '/assets/images/placeholder-rings.svg',
    images: ['/assets/images/placeholder-rings.svg', '/assets/images/placeholder-jewellery.svg'],
    description: ''
  };

  mockOrders = [
    {
      number: 'ART-849201',
      date: '19 Sep 2026',
      customer: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      paymentMethod: 'RAZORPAY',
      total: 45000,
      paymentStatus: 'PAID',
      status: 'PROCESSING'
    },
    {
      number: 'ART-732104',
      date: '18 Sep 2026',
      customer: 'Ananya Roy',
      email: 'ananya.roy@example.com',
      paymentMethod: 'RAZORPAY',
      total: 89000,
      paymentStatus: 'PAID',
      status: 'SHIPPED'
    },
    {
      number: 'ART-619283',
      date: '17 Sep 2026',
      customer: 'Meera Patel',
      email: 'meera.patel@example.com',
      paymentMethod: 'COD',
      total: 24500,
      paymentStatus: 'PENDING',
      status: 'PROCESSING'
    }
  ];

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

    const savedAdmins = localStorage.getItem('arista_created_admins');
    if (savedAdmins) {
      try {
        this.createdAdminUsers = JSON.parse(savedAdmins);
      } catch {
        this.createdAdminUsers = [];
      }
    }

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
    });

    this.mockDataService.getCategories().subscribe(cats => {
      this.categories = cats;
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

    let imagesList: string[] = Array.isArray(product.images) && product.images.length > 0 
      ? [...product.images] 
      : (img ? [img] : ['/assets/images/placeholder-rings.svg']);

    this.editingProduct = {
      id: product.id,
      name: product.name,
      category: product.category || 'Rings',
      price: product.price,
      compareAtPrice: product.compareAtPrice || null,
      badge: product.badge || '',
      image: img || '/assets/images/placeholder-rings.svg',
      images: imagesList,
      stockQuantity: product.stockQuantity || 10,
      description: product.description || ''
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
    if (!this.editingProduct || !this.editingProduct.name || !this.editingProduct.price) return;

    let finalImage = this.editingProduct.image && this.editingProduct.image.trim() !== ''
      ? this.editingProduct.image.trim()
      : this.defaultImage;

    if (!finalImage.startsWith('http') && !finalImage.startsWith('data:') && !finalImage.startsWith('/')) {
      finalImage = '/' + finalImage;
    }

    const imagesList = this.editingProduct.images && this.editingProduct.images.length > 0
      ? this.editingProduct.images
      : [finalImage];

    const payload = {
      ...this.editingProduct,
      image: finalImage,
      images: imagesList
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
      name: this.editingProduct.name,
      category: this.editingProduct.category,
      price: Number(this.editingProduct.price),
      compareAtPrice: this.editingProduct.compareAtPrice ? Number(this.editingProduct.compareAtPrice) : undefined,
      badge: (this.editingProduct.badge as any) || undefined,
      image: finalImage,
      images: imagesList,
      stockQuantity: this.editingProduct.stockQuantity,
      description: this.editingProduct.description
    });

    // Update product in local state
    const index = this.products.findIndex(p => p.id === this.editingProduct.id);
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        name: this.editingProduct.name,
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
    if (!this.newProduct.name || !this.newProduct.price) return;

    let finalImage = this.newProduct.image && this.newProduct.image.trim() !== ''
      ? this.newProduct.image.trim()
      : this.defaultImage;

    if (!finalImage.startsWith('http') && !finalImage.startsWith('data:') && !finalImage.startsWith('/')) {
      finalImage = '/' + finalImage;
    }

    const imagesList = this.newProduct.images && this.newProduct.images.length > 0
      ? this.newProduct.images
      : [finalImage];

    const payload = {
      ...this.newProduct,
      image: finalImage,
      images: imagesList
    };

    try {
      const token = this.authService.getToken();
      await fetch(API_ENDPOINTS.ADMIN.PRODUCTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      // Offline fallback
    }

    const createdMockProduct = this.mockDataService.addProduct({
      name: this.newProduct.name,
      category: this.newProduct.category,
      price: Number(this.newProduct.price),
      compareAtPrice: this.newProduct.compareAtPrice ? Number(this.newProduct.compareAtPrice) : undefined,
      badge: (this.newProduct.badge as 'NEW' | 'SALE' | 'FEATURED' | 'BESTSELLER') || undefined,
      image: finalImage,
      images: imagesList,
      stockQuantity: this.newProduct.stockQuantity,
      description: this.newProduct.description
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

    this.showAddProductModal = false;
    this.successMessage = '';
    this.newSystemFileName = '';
    this.newProduct = {
      name: '',
      category: 'Rings',
      price: 45000,
      compareAtPrice: 52000,
      badge: 'NEW',
      stockQuantity: 10,
      image: '/assets/images/placeholder-rings.svg',
      images: ['/assets/images/placeholder-rings.svg', '/assets/images/placeholder-jewellery.svg'],
      description: ''
    };
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

  async onCreateAdmin(event: Event): Promise<void> {
    event.preventDefault();
    this.newAdminSuccessMessage = '';
    this.newAdminErrorMessage = '';

    if (!this.newAdminForm.name || !this.newAdminForm.email || !this.newAdminForm.password) {
      this.newAdminErrorMessage = 'Please fill in all required fields (Name, Email, Password).';
      return;
    }

    if (this.createdAdminUsers.length >= 1) {
      this.newAdminErrorMessage = 'Maximum Limit Reached: Only 1 additional Admin User account is allowed.';
      return;
    }

    const res = await this.authService.createAdminUser(
      this.newAdminForm.name,
      this.newAdminForm.email,
      this.newAdminForm.password
    );

    if (res.success) {
      this.newAdminErrorMessage = '';
      this.newAdminSuccessMessage = res.message || 'Secondary Admin user registered successfully!';

      const newAdminObj = {
        id: Date.now(),
        name: this.newAdminForm.name,
        email: this.newAdminForm.email,
        role: 'ADMIN',
        createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'ACTIVE'
      };
      this.createdAdminUsers = [...this.createdAdminUsers, newAdminObj];
      localStorage.setItem('arista_created_admins', JSON.stringify(this.createdAdminUsers));

      this.newAdminForm = { name: '', email: '', password: '' };
    } else {
      this.newAdminSuccessMessage = '';
      this.newAdminErrorMessage = res.message;
    }
  }

  deleteAdminUser(adminId: number): void {
    this.createdAdminUsers = this.createdAdminUsers.filter(a => a.id !== adminId);
    localStorage.setItem('arista_created_admins', JSON.stringify(this.createdAdminUsers));
    this.newAdminErrorMessage = '';
    this.newAdminSuccessMessage = 'Admin user account revoked and removed successfully.';
  }

  deleteProduct(productId: number): void {
    const item = this.products.find(p => p.id === productId);
    const name = item ? item.name : `ID ${productId}`;
    this.products = this.products.filter(p => p.id !== productId);
    this.mockDataService.deleteProduct(productId);
    this.showToast(`Jewellery product "${name}" deleted from storefront.`, 'success');
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

    if (!this.newCategory.name.trim()) {
      this.categoryErrorMessage = 'Please enter a category name.';
      return;
    }
    if (!this.newCategory.slug.trim()) {
      this.categoryErrorMessage = 'Please enter a category slug.';
      return;
    }

    const payload = {
      name: this.newCategory.name.trim(),
      slug: this.newCategory.slug.trim(),
      description: this.newCategory.description.trim() || `${this.newCategory.name} Collection`,
      image: this.newCategory.image || '/assets/images/hero-categories.jpg'
    };

    try {
      const token = this.authService.getToken();
      await fetch(API_ENDPOINTS.ADMIN.CATEGORIES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      // Offline fallback
    }

    const added = this.mockDataService.addCategory({
      ...payload,
      featured: true
    });

    const catName = added.name;
    this.showAddCategoryModal = false;
    this.categorySuccessMessage = '';
    this.newCategory = {
      name: '',
      slug: '',
      description: '',
      image: '/assets/images/hero-categories.jpg'
    };
    this.newCategoryFileName = '';
    this.showToast(`Category "${catName}" published successfully!`, 'success');
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
    if (!this.editingCategory || !this.editingCategory.name) return;

    const payload = {
      name: this.editingCategory.name.trim(),
      slug: this.editingCategory.slug.trim(),
      description: this.editingCategory.description.trim(),
      image: this.editingCategory.image,
      featured: this.editingCategory.featured
    };

    try {
      const token = this.authService.getToken();
      await fetch(API_ENDPOINTS.ADMIN.CATEGORY_BY_ID(this.editingCategory.id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
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
