import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/mock/mock-data.service';
import { ProductCardData } from '../../core/models/product-card-data.model';
import { AuthService } from '../../core/services/auth.service';

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
            <span class="metric-label">Total Completed Orders</span>
            <span class="metric-value">12</span>
            <span class="metric-sub">+3 Orders Today</span>
          </div>

          <div class="metric-card">
            <span class="metric-label">Total Store Revenue</span>
            <span class="metric-value">₹2,54,000</span>
            <span class="metric-sub">Verified via Razorpay</span>
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
            [class.active]="activeTab === 'add-product'"
            (click)="activeTab = 'add-product'"
          >
            + Add New Jewellery Piece
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
            ⚙ Admin Credentials & Security
          </button>
        </div>

        <!-- TAB 1: PRODUCT CATALOG TABLE -->
        <div *ngIf="activeTab === 'products'" class="tab-content">
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

        <!-- TAB 2: ADD PRODUCT FORM -->
        <div *ngIf="activeTab === 'add-product'" class="tab-content">
          <div class="form-card">
            <h2 class="form-title">Add New Jewellery Creation to Catalog</h2>
            <div class="success-banner" *ngIf="successMessage">
              ✓ {{ successMessage }}
            </div>

            <form (submit)="saveProduct($event)" class="product-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Product Name *</label>
                  <input type="text" [(ngModel)]="newProduct.name" name="name" placeholder="e.g. Royal Heritage Ruby Pendant" required />
                </div>
                <div class="form-group">
                  <label>Category *</label>
                  <select [(ngModel)]="newProduct.category" name="category" required>
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

              <!-- UPLOAD PHOTO FROM DEVICE & INITIAL STOCK QUANTITY ROW -->
              <div class="form-row">
                <div class="form-group">
                  <label>Upload your photo (Select from device/computer) *</label>
                  <input
                    #newFileInput
                    type="file"
                    accept="image/*"
                    (change)="onFileSelected($event, 'new')"
                    class="custom-file-input"
                  />
                  <div class="system-file-badge" *ngIf="newSystemFileName || isDataUrl(newProduct.image)" style="margin-top: 6px;">
                    <span>✓ Selected Photo: <strong>{{ newSystemFileName || 'Local Photo File' }}</strong></span>
                    <button type="button" class="btn-clear-file" (click)="clearSystemFile('new')">✕ Clear</button>
                  </div>
                </div>

                <div class="form-group">
                  <label>INITIAL STOCK QUANTITY</label>
                  <input type="number" [(ngModel)]="newProduct.stockQuantity" name="stockQuantity" placeholder="10" />
                </div>
              </div>

              <!-- Live Image Preview Box -->
              <div class="preview-box">
                <span class="preview-label">Live Image Preview:</span>
                <div class="preview-img-container">
                  <img
                    [src]="newProduct.image || defaultImage"
                    (error)="onPreviewImageError($event)"
                    alt="Product Preview"
                    class="preview-img"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Product Description & Atelier Craft Notes</label>
                <textarea rows="4" [(ngModel)]="newProduct.description" name="description" placeholder="Describe the gold karatage, diamond clarity, craftsmanship..."></textarea>
              </div>

              <button type="submit" class="btn-save">+ Publish Product to Storefront</button>
            </form>
          </div>
        </div>

        <!-- TAB 3: CUSTOMER ORDERS TABLE -->
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

          <!-- UPLOAD YOUR PHOTO FROM DEVICE FIELD -->
          <div class="form-group" style="margin-top: 14px;">
            <label>Upload your photo (Select from device/computer) *</label>
            <input
              #editFileInput
              type="file"
              accept="image/*"
              (change)="onFileSelected($event, 'edit')"
              class="custom-file-input"
            />
            <div class="system-file-badge" *ngIf="editSystemFileName || isDataUrl(editingProduct.image)" style="margin-top: 6px;">
              <span>✓ Selected Photo: <strong>{{ editSystemFileName || 'Local Photo File' }}</strong></span>
              <button type="button" class="btn-clear-file" (click)="clearSystemFile('edit')">✕ Clear</button>
            </div>
          </div>

          <!-- Live Image Preview Box -->
          <div class="preview-box">
            <span class="preview-label">Live Image Preview:</span>
            <div class="preview-img-container">
              <img
                [src]="editingProduct.image || defaultImage"
                (error)="onPreviewImageError($event)"
                alt="Edit Preview"
                class="preview-img"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="closeEditModal()">Cancel</button>
            <button type="submit" class="btn-save" style="margin-top:0;">Save Product Changes</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
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
      background: #C62828;
      color: #FFFFFF;
      border: none;
      font-weight: 600;
      font-size: 0.88rem;
      padding: 8px 20px;
      border-radius: 50px;
      cursor: pointer;
      transition: background var(--transition-fast);
    }

    .btn-logout:hover {
      background: #B71C1C;
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
  `]
})
export class AdminComponent implements OnInit {
  defaultImage = DEFAULT_FALLBACK_IMAGE;
  activeTab: 'products' | 'add-product' | 'orders' | 'credentials' = 'products';
  products: ProductCardData[] = [];
  successMessage: string = '';

  adminUser: any = null;

  editingProduct: any = null;
  editSuccessMessage: string = '';

  newSystemFileName: string = '';
  editSystemFileName: string = '';

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
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
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
        } else if (this.editingProduct) {
          this.editingProduct.image = result;
          this.editSystemFileName = fileName;
        }
      };
      reader.readAsDataURL(file);
    }
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

  editProduct(product: ProductCardData): void {
    let img = product.image ? product.image.trim() : '';
    if (img && !img.startsWith('http') && !img.startsWith('data:') && !img.startsWith('/')) {
      img = '/' + img;
    }

    this.editingProduct = {
      id: product.id,
      name: product.name,
      category: product.category || 'Rings',
      price: product.price,
      compareAtPrice: product.compareAtPrice || null,
      badge: product.badge || '',
      image: img || '/assets/images/placeholder-rings.svg',
      stockQuantity: 10,
      description: ''
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

    const payload = {
      ...this.editingProduct,
      image: finalImage
    };

    let notificationMsg = `Product ID ${this.editingProduct.id} updated successfully.`;
    let isSuccess = true;

    try {
      const token = this.authService.getToken();
      const res = await fetch(`http://localhost:5000/api/v1/admin/products/${this.editingProduct.id}`, {
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
        image: finalImage
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

    const payload = {
      ...this.newProduct,
      image: finalImage
    };

    try {
      const token = this.authService.getToken();
      await fetch('http://localhost:5000/api/v1/admin/products', {
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
      available: true
    };

    this.products = [createdItem, ...this.products];
    this.successMessage = `Jewellery creation "${this.newProduct.name}" published successfully!`;

    setTimeout(() => {
      this.successMessage = '';
      this.activeTab = 'products';
      this.newSystemFileName = '';
      this.newProduct = {
        name: '',
        category: 'Rings',
        price: 45000,
        compareAtPrice: 52000,
        badge: 'NEW',
        stockQuantity: 10,
        image: '/assets/images/placeholder-rings.svg',
        description: ''
      };
    }, 1800);
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
}
