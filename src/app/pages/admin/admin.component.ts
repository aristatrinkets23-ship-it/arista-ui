import { Component, OnInit, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/mock/mock-data.service';
import { ProductService } from '../../core/services/product.service';
import { CategoryService, getDefaultCategoryImage } from '../../core/services/category.service';
import { ProductCardData } from '../../core/models/product-card-data.model';
import { Category } from '../../core/models/category.model';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { SettingsService } from '../../core/services/settings.service';

const DEFAULT_FALLBACK_IMAGE = '/assets/images/placeholder-jewellery.svg';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- Floating Luxury Toast Notification Banner -->
    <div class="toast-notification-wrap" *ngIf="toastMessage">
      <div class="toast-card" [class.success]="toastType === 'success'" [class.error]="toastType === 'error'">
        <div class="toast-icon-box">
          <svg *ngIf="toastType === 'success'" class="toast-svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <svg *ngIf="toastType === 'error'" class="toast-svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="toast-content">
          <div class="toast-title">{{ toastTitle || (toastType === 'success' ? 'Success' : 'Notice') }}</div>
          <div class="toast-message">{{ toastMessage }}</div>
        </div>
        <button type="button" class="btn-close-toast" (click)="dismissToast()" aria-label="Close notification">
          <svg class="close-icon-svg" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
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
      <div class="container admin-container">
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
            <span class="metric-value">{{ ordersList.length }}</span>
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
            (click)="activeTab = 'orders'; loadAdminOrders()"
          >
            Customer Orders ({{ ordersList.length }})
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'credentials'"
            (click)="activeTab = 'credentials'"
          >
            ⚙ Admin Credentials
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'homepage-photos'"
            (click)="activeTab = 'homepage-photos'"
          >
            🖼 Homepage Photos
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'settings'"
            (click)="activeTab = 'settings'; loadStoreSettings()"
          >
            ⚙ Store &amp; GST Settings
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
                  <th style="width: 48px; text-align: center;">#</th>
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
                  <td colspan="7" style="text-align: center; padding: 36px; color: #7A6658; font-weight: 500;">
                    No data found in category catalog. Click <strong>+ Add New Category</strong> above to create collections.
                  </td>
                </tr>
                <tr *ngFor="let cat of pagedCategories; let i = index">
                  <td style="text-align: center; font-weight: 700; color: var(--brand-mocha-brown); font-size: 0.88rem;">
                    {{ (categoryCurrentPage - 1) * categoryPageSize + i + 1 }}
                  </td>
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

          <!-- Pagination Controls for Categories -->
          <div *ngIf="categories.length > 0" class="pagination-bar">
            <div class="pagination-info">
              Showing <strong>{{ (categoryCurrentPage - 1) * categoryPageSize + 1 }}</strong> to
              <strong>{{ getMin(categoryCurrentPage * categoryPageSize, categories.length) }}</strong> of
              <strong>{{ categories.length }}</strong> categories
            </div>
            <div class="pagination-controls">
              <div class="page-size-selector">
                <label>Per page:</label>
                <select [(ngModel)]="categoryPageSize" (change)="onCategoryPageSizeChange()">
                  <option [ngValue]="5">5</option>
                  <option [ngValue]="10">10</option>
                  <option [ngValue]="20">20</option>
                  <option [ngValue]="50">50</option>
                </select>
              </div>
              <button type="button" class="btn-page" [disabled]="categoryCurrentPage === 1" (click)="setCategoryPage(categoryCurrentPage - 1)">&larr; Prev</button>
              <button *ngFor="let p of categoryPageNumbers" type="button" class="btn-page-num" [class.active]="p === categoryCurrentPage" (click)="setCategoryPage(p)">{{ p }}</button>
              <button type="button" class="btn-page" [disabled]="categoryCurrentPage === categoryTotalPages" (click)="setCategoryPage(categoryCurrentPage + 1)">Next &rarr;</button>
            </div>
          </div>
        </div>

        <!-- TAB 2: PRODUCT CATALOG TABLE -->
        <div *ngIf="activeTab === 'products'" class="tab-content">
          <div class="tab-action-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
              <h3 style="font-family: var(--font-serif); color: var(--brand-mocha-brown); margin: 0; font-size: 1.2rem;">Product Catalog ({{ filteredProducts.length }})</h3>
              
              <!-- Visibility Filter Dropdown -->
              <div style="display: flex; align-items: center; gap: 6px;">
                <label style="font-size: 0.78rem; font-weight: 700; color: var(--brand-mocha-brown);">Visibility Filter:</label>
                <select [(ngModel)]="productFilterVisibility" (change)="productCurrentPage = 1" style="padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: 0.82rem; font-weight: 600; color: var(--brand-mocha-brown); background: #FFFFFF;">
                  <option value="all">All Products ({{ products.length }})</option>
                  <option value="active">🟢 Active Only ({{ activeProductsCount }})</option>
                  <option value="inactive">🔴 Hidden / Inactive Only ({{ inactiveProductsCount }})</option>
                </select>
              </div>
            </div>

            <button type="button" class="btn-save" style="margin-top: 0; padding: 10px 22px;" (click)="openAddProductModal()">
              + Add New Jewellery Piece
            </button>
          </div>
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th style="width: 44px; text-align: center; white-space: nowrap;">#</th>
                  <th style="width: 70px; white-space: nowrap;">Jewel</th>
                  <th style="min-width: 180px; white-space: nowrap;">Name &amp; Category</th>
                  <th style="width: 110px; white-space: nowrap;">Price</th>
                  <th style="width: 130px; white-space: nowrap;">Compare Price</th>
                  <th style="width: 100px; white-space: nowrap;">Badge</th>
                  <th style="width: 130px; white-space: nowrap;">Stock Status</th>
                  <th style="width: 110px; white-space: nowrap;">Visibility</th>
                  <th style="width: 120px; text-align: center; white-space: nowrap;">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="filteredProducts.length === 0">
                  <td colspan="9" style="text-align: center; padding: 36px; color: #7A6658;">
                    No products found matching the selected visibility filter. Click <strong>+ Add New Jewellery Piece</strong> above to create a product.
                  </td>
                </tr>
                <tr *ngFor="let item of pagedProducts; let i = index">
                  <td style="text-align: center; font-weight: 700; color: var(--brand-mocha-brown); font-size: 0.88rem;">
                    {{ (productCurrentPage - 1) * productPageSize + i + 1 }}
                  </td>
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
                  <td style="white-space: nowrap;">
                    <strong class="item-price">₹{{ item.price | number }}</strong>
                  </td>
                  <td style="white-space: nowrap;">
                    <span class="item-compare" *ngIf="item.compareAtPrice">₹{{ item.compareAtPrice | number }}</span>
                    <span *ngIf="getDiscountPercentage(item) > 0" style="display: inline-block; background: #FEF2F2; color: #DC2626; font-weight: 700; font-size: 0.68rem; padding: 2px 6px; border-radius: 10px; margin-left: 6px;">
                      {{ getDiscountPercentage(item) }}% OFF
                    </span>
                    <span *ngIf="!item.compareAtPrice">-</span>
                  </td>
                  <td>
                    <span class="badge-tag" *ngIf="item.badge">{{ item.badge }}</span>
                    <span *ngIf="!item.badge">-</span>
                  </td>
                  <td style="white-space: nowrap;">
                    <span class="stock-pill in-stock" *ngIf="item.inStock !== false && (item.stockQuantity === undefined || item.stockQuantity > 0)">In Stock ({{ item.stockQuantity !== undefined ? item.stockQuantity : 10 }})</span>
                    <span class="stock-pill out-stock" *ngIf="item.inStock === false || item.stockQuantity === 0">Out of Stock</span>
                  </td>
                  <td style="white-space: nowrap;">
                    <span class="badge-status success" *ngIf="item.available !== false && item.isActive !== false" style="background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px;">
                      🟢 Active
                    </span>
                    <span class="badge-status error" *ngIf="item.available === false || item.isActive === false" style="background: #FEF2F2; color: #DC2626; border: 1px solid #FCA5A5; padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px;">
                      🔴 Hidden
                    </span>
                  </td>
                  <td>
                    <div class="action-btns" style="justify-content: center;">
                      <button type="button" class="btn-action edit" (click)="editProduct(item)">Edit</button>
                      <button type="button" class="btn-action delete" (click)="promptDeleteProduct(item)">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls for Products -->
          <div *ngIf="products.length > 0" class="pagination-bar">
            <div class="pagination-info">
              Showing <strong>{{ (productCurrentPage - 1) * productPageSize + 1 }}</strong> to
              <strong>{{ getMin(productCurrentPage * productPageSize, products.length) }}</strong> of
              <strong>{{ products.length }}</strong> products
            </div>
            <div class="pagination-controls">
              <div class="page-size-selector">
                <label>Per page:</label>
                <select [(ngModel)]="productPageSize" (change)="onProductPageSizeChange()">
                  <option [ngValue]="5">5</option>
                  <option [ngValue]="10">10</option>
                  <option [ngValue]="20">20</option>
                  <option [ngValue]="50">50</option>
                </select>
              </div>
              <button type="button" class="btn-page" [disabled]="productCurrentPage === 1" (click)="setProductPage(productCurrentPage - 1)">&larr; Prev</button>
              <button *ngFor="let p of productPageNumbers" type="button" class="btn-page-num" [class.active]="p === productCurrentPage" (click)="setProductPage(p)">{{ p }}</button>
              <button type="button" class="btn-page" [disabled]="productCurrentPage === productTotalPages" (click)="setProductPage(productCurrentPage + 1)">Next &rarr;</button>
            </div>
          </div>
        </div>

        <!-- TAB 3: CUSTOMER ORDERS TABLE WITH FILTERS -->
        <div *ngIf="activeTab === 'orders'" class="tab-content">
          <!-- Order Financial Summary Metric Cards -->
          <div class="orders-summary-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 20px;">
            <!-- Card 1: Total Orders Value -->
            <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-left: 4px solid var(--brand-warm-gold); padding: 18px 20px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
              <div style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--brand-mocha-brown);">Total Orders Value</div>
              <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 1.65rem; font-weight: 700; color: var(--brand-mocha-brown); margin: 6px 0 2px 0;">
                ₹{{ orderSummaryMetrics.totalRevenue | number:'1.0-0' }}
              </div>
              <div style="font-size: 0.78rem; color: #666; font-weight: 500;">
                Across {{ orderTotalItems || ordersList.length }} total order(s)
              </div>
            </div>

            <!-- Card 2: Paid Amount -->
            <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-left: 4px solid #10B981; padding: 18px 20px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
              <div style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #047857;">Paid / Collected Revenue</div>
              <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 1.65rem; font-weight: 700; color: #047857; margin: 6px 0 2px 0;">
                ₹{{ orderSummaryMetrics.paidRevenue | number:'1.0-0' }}
              </div>
              <div style="font-size: 0.78rem; color: #059669; font-weight: 500;">
                ✓ Verified Paid Payments
              </div>
            </div>

            <!-- Card 3: Pending Amount -->
            <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-left: 4px solid #F59E0B; padding: 18px 20px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
              <div style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #D97706;">Pending Payment Amount</div>
              <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 1.65rem; font-weight: 700; color: #D97706; margin: 6px 0 2px 0;">
                ₹{{ orderSummaryMetrics.pendingRevenue | number:'1.0-0' }}
              </div>
              <div style="font-size: 0.78rem; color: #B45309; font-weight: 500;">
                ⏳ Cash on Delivery / Unpaid
              </div>
            </div>

            <!-- Card 4: Cancelled Amount -->
            <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-left: 4px solid #EF4444; padding: 18px 20px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
              <div style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #DC2626;">Cancelled Orders Value</div>
              <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 1.65rem; font-weight: 700; color: #DC2626; margin: 6px 0 2px 0;">
                ₹{{ orderSummaryMetrics.cancelledRevenue | number:'1.0-0' }}
              </div>
              <div style="font-size: 0.78rem; color: #B91C1C; font-weight: 500;">
                ✕ Returned / Cancelled Orders
              </div>
            </div>
          </div>

          <!-- Filter Toolbar Card -->
          <div class="filter-toolbar-card" style="background: #FFFFFF; border: 1px solid var(--color-border); padding: 18px 20px; border-radius: var(--radius-md); margin-bottom: 20px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
              <h3 style="font-family: var(--font-serif); color: var(--brand-mocha-brown); margin: 0; font-size: 1.25rem;">
                Customer Orders &amp; Fulfillment Tracker ({{ ordersList.length }})
              </h3>
              <button type="button" class="btn-cancel" style="padding: 6px 16px; font-size: 0.8rem;" (click)="resetOrderFilters()">
                ↻ Reset All Filters
              </button>
            </div>

            <!-- Filter Controls Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 14px; align-items: end;">
              
              <!-- Search Filter -->
              <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.75rem; font-weight: 700; color: var(--brand-mocha-brown); margin-bottom: 4px;">Search Order / Customer</label>
                <input
                  type="text"
                  [(ngModel)]="orderSearchQuery"
                  (keyup.enter)="loadAdminOrders()"
                  placeholder="Order #, Name, Email, TRK..."
                  style="padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: 0.85rem;"
                />
              </div>

              <!-- Order Status Filter -->
              <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.75rem; font-weight: 700; color: var(--brand-mocha-brown); margin-bottom: 4px;">Fulfillment Status</label>
                <select [(ngModel)]="orderFilterStatus" (change)="loadAdminOrders()" style="padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: 0.85rem;">
                  <option value="">All Fulfillment Statuses</option>
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <!-- Payment Status Filter -->
              <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.75rem; font-weight: 700; color: var(--brand-mocha-brown); margin-bottom: 4px;">Payment Status</label>
                <select [(ngModel)]="orderFilterPaymentStatus" (change)="loadAdminOrders()" style="padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: 0.85rem;">
                  <option value="">All Payment Statuses</option>
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="FAILED">FAILED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <!-- Date From Filter -->
              <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.75rem; font-weight: 700; color: var(--brand-mocha-brown); margin-bottom: 4px;">Placed Date From</label>
                <input
                  type="date"
                  [(ngModel)]="orderFilterDateFrom"
                  (change)="loadAdminOrders()"
                  style="padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: 0.85rem;"
                />
              </div>

              <!-- Date To Filter -->
              <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.75rem; font-weight: 700; color: var(--brand-mocha-brown); margin-bottom: 4px;">Placed Date To</label>
                <input
                  type="date"
                  [(ngModel)]="orderFilterDateTo"
                  (change)="loadAdminOrders()"
                  style="padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: 0.85rem;"
                />
              </div>

            </div>
          </div>

          <!-- Orders Data Table (No Horizontal Scroll) -->
          <div class="orders-table-wrapper">
            <table class="admin-table orders-table">
              <thead>
                <tr>
                  <th style="width: 32px; text-align: center;">#</th>
                  <th style="width: 110px;">Order</th>
                  <th style="width: 140px;">Customer</th>
                  <th style="width: 115px;">Payment</th>
                  <th style="width: 85px; text-align: right;">Total</th>
                  <th style="width: 120px;">Fulfillment</th>
                  <th style="width: 105px;">Item Details</th>
                  <th style="width: 115px;">Update Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="isLoadingOrders">
                  <td colspan="8" style="text-align: center; padding: 36px; color: #7A6658; font-weight: 500;">
                    Loading customer orders...
                  </td>
                </tr>
                <tr *ngIf="!isLoadingOrders && ordersList.length === 0">
                  <td colspan="8" style="text-align: center; padding: 36px; color: #7A6658; font-weight: 500;">
                    No orders found matching the selected filters.
                  </td>
                </tr>
                <tr *ngFor="let order of ordersList; let i = index">
                  <td style="text-align: center; font-weight: 700; color: var(--brand-mocha-brown); font-size: 0.8rem;">
                    {{ (orderCurrentPage - 1) * orderPageSize + i + 1 }}
                  </td>
                  <td>
                    <strong class="order-no" style="font-size: 0.88rem; color: var(--brand-mocha-brown); display: block;">#{{ order.order_number || order.number }}</strong>
                    <span class="order-date" style="display: block; font-size: 0.72rem; color: #666; margin-top: 1px;">
                      📅 {{ order.ordered_at || order.created_at || order.date }}
                    </span>
                    <span *ngIf="order.tracking_code" style="display: inline-block; background: var(--brand-pearl-beige); color: var(--brand-mocha-brown); font-family: monospace; font-size: 0.68rem; padding: 1px 5px; border-radius: 3px; margin-top: 2px; border: 1px solid var(--color-border);">
                      🏷️ {{ order.tracking_code }}
                    </span>
                  </td>
                  <td>
                    <strong class="cust-name" style="font-size: 0.85rem; color: #2C221E; display: block;">{{ order.customer_name || order.customer }}</strong>
                    <span class="cust-email" style="display: block; font-size: 0.74rem; color: #666; word-break: break-all;">{{ order.customer_email || order.email }}</span>
                    <span *ngIf="order.customer_phone" style="display: block; font-size: 0.72rem; color: #888;">📞 {{ order.customer_phone }}</span>
                  </td>
                  <td>
                    <div style="display: flex; flex-direction: column; gap: 3px; align-items: flex-start;">
                      <span class="pay-method" style="font-weight: 700; font-size: 0.76rem; color: #444;">{{ order.payment_method || order.paymentMethod }}</span>
                      
                      <span class="status-badge paid" *ngIf="(order.payment_status || order.paymentStatus) === 'PAID'" style="font-size: 0.68rem; padding: 2px 7px;">
                        PAID
                      </span>
                      
                      <div *ngIf="(order.payment_status || order.paymentStatus) === 'PENDING'" style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
                        <span class="status-badge pending" style="font-size: 0.68rem; padding: 2px 6px;">PENDING</span>
                        <button
                          type="button"
                          class="btn-mark-paid"
                          (click)="toggleOrderPaymentStatus(order, 'PAID')"
                          title="Mark Cash as Collected / Paid"
                        >
                          ✓ Paid
                        </button>
                      </div>

                      <span class="status-badge failed" *ngIf="(order.payment_status || order.paymentStatus) === 'FAILED'" style="background: #FFEBEE; color: #C62828; font-size: 0.68rem; padding: 2px 6px;">
                        FAILED
                      </span>
                    </div>
                  </td>
                  <td style="text-align: right;">
                    <strong class="item-price" style="font-size: 0.95rem; color: var(--brand-warm-gold);">₹{{ (order.total_amount || order.total) | number }}</strong>
                  </td>
                  <td>
                    <span class="status-badge shipped" *ngIf="(order.order_status || order.status) === 'SHIPPED'" style="font-size: 0.7rem; padding: 2px 8px;">SHIPPED</span>
                    <span class="status-badge processing" *ngIf="(order.order_status || order.status) === 'PROCESSING'" style="font-size: 0.7rem; padding: 2px 8px;">PROCESSING</span>
                    <span class="status-badge delivered" *ngIf="(order.order_status || order.status) === 'DELIVERED'" style="background: #E8F5E9; color: #2E7D32; font-size: 0.7rem; padding: 2px 8px;">DELIVERED</span>
                    <span class="status-badge cancelled" *ngIf="(order.order_status || order.status) === 'CANCELLED'" style="background: #FFEBEE; color: #C62828; font-size: 0.7rem; padding: 2px 8px;">CANCELLED</span>
                    <span class="status-badge pending" *ngIf="(order.order_status || order.status) === 'PENDING'" style="font-size: 0.7rem; padding: 2px 8px;">PENDING</span>

                    <div style="font-size: 0.68rem; color: #666; margin-top: 3px; font-weight: 500;">
                      <span *ngIf="(order.order_status || order.status) === 'DELIVERED'">✓ {{ order.delivered_at || order.ordered_at }}</span>
                      <span *ngIf="(order.order_status || order.status) === 'SHIPPED'">🚚 {{ order.shipped_at || order.ordered_at }}</span>
                      <span *ngIf="(order.order_status || order.status) === 'PROCESSING'">⏱ {{ order.processing_at || order.ordered_at }}</span>
                      <span *ngIf="(order.order_status || order.status) === 'CANCELLED'">✕ {{ order.cancelled_at || order.ordered_at }}</span>
                      <span *ngIf="(order.order_status || order.status) === 'PENDING'">📅 {{ order.ordered_at || order.created_at }}</span>
                    </div>

                    <!-- Customer Cancellation Reason Tag -->
                    <div *ngIf="(order.order_status || order.status) === 'CANCELLED' && (order.cancellation_reason || order.cancellationReason)"
                         style="margin-top: 6px; padding: 4px 8px; background: #FFF5F5; border: 1px solid #FEB2B2; border-left: 3px solid #E53E3E; border-radius: 4px; font-size: 0.7rem; color: #9B2C2C; line-height: 1.35; max-width: 190px; word-break: break-word;">
                      <div style="font-weight: 700; color: #C53030; display: flex; align-items: center; gap: 3px;">
                        <span>⚠️</span> Reason:
                      </div>
                      <div style="font-style: italic; margin-top: 2px;">"{{ order.cancellation_reason || order.cancellationReason }}"</div>
                      <div *ngIf="order.cancelled_by || order.cancelledBy" style="font-size: 0.64rem; color: #718096; margin-top: 2px; font-weight: 600;">
                        By: {{ (order.cancelled_by || order.cancelledBy) === 'CUSTOMER' ? 'Customer' : 'Atelier Admin' }}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
                      <button type="button" class="btn-compact-action" (click)="selectedOrderForDetails = order">
                        📦 Items ({{ (order.items?.length || 0) }})
                      </button>
                      <a
                        [href]="getInvoicePdfUrl(order)"
                        target="_blank"
                        download
                        class="btn-compact-action invoice"
                        title="Download Official Tax Invoice PDF"
                      >
                        📄 Invoice
                      </a>
                    </div>
                  </td>
                  <td>
                    <select class="status-select-compact" [value]="order.order_status || order.status" (change)="promptChangeOrderStatus(order, $event)">
                      <option value="PENDING">PENDING</option>
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

          <!-- Pagination Controls for Customer Orders -->
          <div *ngIf="!isLoadingOrders && ordersList.length > 0" class="pagination-bar">
            <div class="pagination-info">
              Showing <strong>{{ (orderCurrentPage - 1) * orderPageSize + 1 }}</strong> to
              <strong>{{ getMin(orderCurrentPage * orderPageSize, orderTotalItems || ordersList.length) }}</strong> of
              <strong>{{ orderTotalItems || ordersList.length }}</strong> orders
            </div>
            <div class="pagination-controls">
              <div class="page-size-selector">
                <label>Per page:</label>
                <select [(ngModel)]="orderPageSize" (change)="onOrderPageSizeChange()">
                  <option [ngValue]="5">5</option>
                  <option [ngValue]="10">10</option>
                  <option [ngValue]="20">20</option>
                  <option [ngValue]="50">50</option>
                </select>
              </div>
              <button type="button" class="btn-page" [disabled]="orderCurrentPage === 1" (click)="setOrderPage(orderCurrentPage - 1)">&larr; Prev</button>
              <button *ngFor="let p of orderPageNumbers" type="button" class="btn-page-num" [class.active]="p === orderCurrentPage" (click)="setOrderPage(p)">{{ p }}</button>
              <button type="button" class="btn-page" [disabled]="orderCurrentPage === orderTotalPages || orderTotalPages === 0" (click)="setOrderPage(orderCurrentPage + 1)">Next &rarr;</button>
            </div>
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
                  Manage administrator accounts that have access to this Atelier dashboard.
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
                    <th style="width: 48px; text-align: center;">#</th>
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
                    <td colspan="7" style="text-align: center; padding: 36px; color: #7A6658; font-weight: 500;">
                      No admin accounts found. Click <strong>+ Create New Admin User</strong> above to add one.
                    </td>
                  </tr>
                  <tr *ngFor="let admin of createdAdminUsers; let i = index">
                    <td style="text-align: center; font-weight: 700; color: var(--brand-mocha-brown); font-size: 0.88rem;">
                      {{ i + 1 }}
                    </td>
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

        <!-- TAB 5: HOMEPAGE PHOTOS & CONFIGURATION -->
        <div *ngIf="activeTab === 'homepage-photos'" class="tab-content">
          <div style="margin-bottom: 24px; padding: 16px 20px; background: linear-gradient(135deg, #FAF7F2 0%, #F5EFE6 100%); border-radius: 12px; border: 1px solid #E8DFD5;">
            <h3 style="font-family: var(--font-serif); color: #4A3B32; margin: 0 0 6px 0; font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
              <span>🖼️</span> Homepage Photo Configuration Manager
            </h3>
            <p style="margin: 0; color: #665C54; font-size: 0.95rem; line-height: 1.5;">
              Easily manage all 3 homepage photo sections without technical skills. Upload new photos for editorial banners or manage product badge assignments.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">

            <!-- SECTION 1: EDITORIAL / ARTISANAL EXCELLENCE PHOTO -->
            <div style="background: #ffffff; border-radius: 12px; border: 1px solid #E8DFD5; box-shadow: 0 4px 15px rgba(0,0,0,0.03); padding: 24px; display: flex; flex-direction: column;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                <span style="background: #F4EBE1; color: #7A5C43; font-weight: bold; font-size: 0.8rem; padding: 4px 10px; border-radius: 20px;">Section 1</span>
                <h4 style="margin: 0; font-family: var(--font-serif); color: #3A2E26; font-size: 1.15rem;">Artisanal Excellence (Editorial Photo)</h4>
              </div>
              <p style="font-size: 0.88rem; color: #6C5F56; margin-bottom: 16px; line-height: 1.4;">
                This picture is featured in the main "Artisanal Excellence &amp; Story of Grace" section on the homepage.
              </p>

              <!-- Image Preview Container -->
              <div style="width: 100%; height: 220px; border-radius: 8px; overflow: hidden; border: 2px dashed #D9CFC4; background: #FAF7F4; position: relative; margin-bottom: 16px; display: flex; align-items: center; justify-content: center;">
                <img [src]="newEditorialPhotoPreview || homepageEditorialPhoto" alt="Editorial Preview" style="width: 100%; height: 100%; object-fit: cover;" (error)="onImageError($event)" />
                <span style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.7); color: #fff; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px;">
                  {{ newEditorialPhotoPreview ? 'New Preview' : 'Current Active' }}
                </span>
              </div>

              <!-- Success / Error Alert Messages -->
              <div *ngIf="homepageSaveSuccess" style="background: #EAF8E6; border: 1px solid #C2E8B8; color: #2E6B23; padding: 10px 14px; border-radius: 6px; font-size: 0.88rem; margin-bottom: 14px;">
                ✓ {{ homepageSaveSuccess }}
              </div>
              <div *ngIf="homepageSaveError" style="background: #FDE8E8; border: 1px solid #F8B4B4; color: #9B1C1C; padding: 10px 14px; border-radius: 6px; font-size: 0.88rem; margin-bottom: 14px;">
                ⚠️ {{ homepageSaveError }}
              </div>

              <!-- Upload Actions -->
              <div style="margin-top: auto; display: flex; flex-direction: column; gap: 10px;">
                <label style="display: inline-block; cursor: pointer; text-align: center; padding: 10px 16px; background: #F3ECE2; border: 1px solid #D9CBB9; color: #4A3B32; font-weight: 600; font-size: 0.9rem; border-radius: 6px; transition: all 0.2s;">
                  📁 Select New Photo from Computer
                  <input type="file" accept="image/*" style="display: none;" (change)="onEditorialPhotoSelected($event)" />
                </label>

                <div style="display: flex; gap: 10px;" *ngIf="newEditorialPhotoPreview">
                  <button type="button" class="btn-save" style="flex: 1; margin: 0; padding: 10px 16px;" [disabled]="isSavingHomepagePhoto" (click)="saveEditorialPhoto()">
                    {{ isSavingHomepagePhoto ? 'Saving...' : '💾 Save & Publish Photo' }}
                  </button>
                  <button type="button" class="btn-cancel" style="padding: 10px 14px;" (click)="newEditorialPhotoPreview = ''">
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <!-- SECTION 2: NEW ARRIVALS PHOTO GALLERY GUIDE -->
            <div style="background: #ffffff; border-radius: 12px; border: 1px solid #E8DFD5; box-shadow: 0 4px 15px rgba(0,0,0,0.03); padding: 24px; display: flex; flex-direction: column;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                <span style="background: #E2EFF8; color: #1E557F; font-weight: bold; font-size: 0.8rem; padding: 4px 10px; border-radius: 20px;">Section 2</span>
                <h4 style="margin: 0; font-family: var(--font-serif); color: #3A2E26; font-size: 1.15rem;">New Arrivals Photos</h4>
              </div>
              <p style="font-size: 0.88rem; color: #6C5F56; margin-bottom: 14px; line-height: 1.4;">
                Photos shown in <strong>New Arrivals</strong> are automatically fetched from products tagged with the <strong>NEW</strong> badge.
              </p>

              <div style="background: #F9F6F0; border-left: 4px solid #7A5C43; padding: 12px 14px; border-radius: 0 6px 6px 0; margin-bottom: 16px;">
                <div style="font-weight: 600; font-size: 0.85rem; color: #4A3B32; margin-bottom: 4px;">💡 How to change photo / add item here:</div>
                <div style="font-size: 0.82rem; color: #665C54;">
                  Go to <strong>Product Catalog</strong> tab &rarr; Edit any product &rarr; Set <strong>Badge</strong> to <strong>NEW</strong> &amp; upload image.
                </div>
              </div>

              <!-- Active NEW Products Mini Gallery -->
              <div style="margin-top: auto;">
                <div style="font-size: 0.82rem; font-weight: bold; color: #7A5C43; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                  Active New Arrivals Photos:
                </div>
                <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px;">
                  <ng-container *ngFor="let prod of products">
                    <div *ngIf="prod.badge === 'NEW' || prod.badge === 'NEW ARRIVAL'" style="flex: 0 0 60px; text-align: center;">
                      <img [src]="prod.image" [alt]="prod.name" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #E0D6C8;" (error)="onImageError($event)" />
                      <div style="font-size: 0.7rem; color: #555; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 60px; margin-top: 2px;">{{ prod.name }}</div>
                    </div>
                  </ng-container>
                </div>
              </div>
            </div>

            <!-- SECTION 3: BESTSELLERS / @ARISTATRINKETS PHOTO GALLERY GUIDE -->
            <div style="background: #ffffff; border-radius: 12px; border: 1px solid #E8DFD5; box-shadow: 0 4px 15px rgba(0,0,0,0.03); padding: 24px; display: flex; flex-direction: column;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                <span style="background: #FDF3E5; color: #A06414; font-weight: bold; font-size: 0.8rem; padding: 4px 10px; border-radius: 20px;">Section 3</span>
                <h4 style="margin: 0; font-family: var(--font-serif); color: #3A2E26; font-size: 1.15rem;">Bestsellers / @aristatrinkets Photos</h4>
              </div>
              <p style="font-size: 0.88rem; color: #6C5F56; margin-bottom: 14px; line-height: 1.4;">
                Photos shown in <strong>Bestsellers &amp; Trinket Grid</strong> are automatically pulled from products tagged with <strong>BESTSELLER</strong> badge.
              </p>

              <div style="background: #F9F6F0; border-left: 4px solid #A06414; padding: 12px 14px; border-radius: 0 6px 6px 0; margin-bottom: 16px;">
                <div style="font-weight: 600; font-size: 0.85rem; color: #4A3B32; margin-bottom: 4px;">💡 How to change photo / add item here:</div>
                <div style="font-size: 0.82rem; color: #665C54;">
                  Go to <strong>Product Catalog</strong> tab &rarr; Edit any product &rarr; Set <strong>Badge</strong> to <strong>BESTSELLER</strong> &amp; update photo.
                </div>
              </div>

              <!-- Active BESTSELLER Products Mini Gallery -->
              <div style="margin-top: auto;">
                <div style="font-size: 0.82rem; font-weight: bold; color: #A06414; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                  Active Bestsellers Photos:
                </div>
                <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px;">
                  <ng-container *ngFor="let prod of products">
                    <div *ngIf="prod.badge === 'BESTSELLER' || prod.badge === 'HOT'" style="flex: 0 0 60px; text-align: center;">
                      <img [src]="prod.image" [alt]="prod.name" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #E0D6C8;" (error)="onImageError($event)" />
                      <div style="font-size: 0.7rem; color: #555; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 60px; margin-top: 2px;">{{ prod.name }}</div>
                    </div>
                  </ng-container>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- TAB 6: STORE SETTINGS & GST CONFIGURATION -->
        <div *ngIf="activeTab === 'settings'" class="tab-content">
          <div style="margin-bottom: 24px; padding: 18px 24px; background: linear-gradient(135deg, #FAF7F2 0%, #F5EFE6 100%); border-radius: 12px; border: 1px solid #E8DFD5; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div>
              <h3 style="font-family: var(--font-serif); color: #3A2E26; margin: 0 0 4px 0; font-size: 1.35rem; display: flex; align-items: center; gap: 10px;">
                <span>⚙️</span> Store Invoicing, GST &amp; Shipping Settings
              </h3>
              <p style="margin: 0; color: #6C5F56; font-size: 0.9rem;">
                Configure your GST details, delivery fees, and business information. Changes take effect immediately on customer carts and invoice PDFs.
              </p>
            </div>
            <button
              type="button"
              class="btn-save"
              style="margin: 0; padding: 12px 28px; font-size: 0.9rem;"
              [disabled]="isSavingSettings"
              (click)="saveStoreSettings()"
            >
              <span *ngIf="!isSavingSettings">💾 Save Changes</span>
              <span *ngIf="isSavingSettings">Saving...</span>
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 24px;">

            <!-- CARD 1: GST & LEGAL BUSINESS IDENTITY -->
            <div style="background: #ffffff; border-radius: 12px; border: 1px solid #E8DFD5; box-shadow: 0 4px 15px rgba(0,0,0,0.03); padding: 24px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; border-bottom: 1.5px solid #F0E8DD; padding-bottom: 12px;">
                <span style="background: #FDF3E5; color: #A06414; font-weight: bold; font-size: 0.8rem; padding: 4px 10px; border-radius: 20px;">Tax &amp; Identity</span>
                <h4 style="margin: 0; font-family: var(--font-serif); color: #3A2E26; font-size: 1.15rem;">GST &amp; Company Invoicing Profile</h4>
              </div>

              <div class="product-form" style="margin-top: 0;">
                <div class="form-group" style="margin-bottom: 14px;">
                  <label style="font-weight: 700; color: #3A2E26; display: flex; justify-content: space-between;">
                    <span>GSTIN (Goods and Services Tax Number) *</span>
                    <span *ngIf="gstinValidationError" style="color: #DC2626; font-size: 0.76rem; font-weight: 600;">{{ gstinValidationError }}</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="storeSettingsForm.gst_number"
                    (input)="validateGstinInput()"
                    placeholder="e.g. 24AAACA1234A1Z5"
                    maxlength="15"
                    style="text-transform: uppercase; font-family: monospace; font-size: 1rem; letter-spacing: 1px;"
                    [style.border-color]="gstinValidationError ? '#DC2626' : ''"
                  />
                  <small style="color: #777; font-size: 0.74rem; margin-top: 4px; display: block;">
                    Standard 15-character Indian GST format (2 digits state code + 10 alphanumeric PAN + 1 entity + Z + 1 checksum).
                  </small>
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                  <label style="font-weight: 700; color: #3A2E26;">GST Tax Rate (%) *</label>
                  <input
                    type="number"
                    [(ngModel)]="storeSettingsForm.gst_percentage"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="3.0"
                  />
                  <small style="color: #777; font-size: 0.74rem; margin-top: 4px; display: block;">
                    Standard GST on jewellery in India is 3% (1.5% CGST + 1.5% SGST or 3% IGST).
                  </small>
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                  <label style="font-weight: 700; color: #3A2E26;">Registered Business Name *</label>
                  <input
                    type="text"
                    [(ngModel)]="storeSettingsForm.company_name"
                    placeholder="Arista Trinkets Atelier"
                  />
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                  <label style="font-weight: 700; color: #3A2E26;">Registered Atelier Address *</label>
                  <textarea
                    [(ngModel)]="storeSettingsForm.company_address"
                    rows="3"
                    placeholder="Studio 101, Jewel Arcade, Near City Centre, Surat, Gujarat - 395001"
                    style="width: 100%; padding: 10px; border: 1.5px solid #D1C7BD; border-radius: 8px; font-size: 0.88rem;"
                  ></textarea>
                </div>

                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="form-group">
                    <label style="font-weight: 700; color: #3A2E26;">Support Phone</label>
                    <input
                      type="text"
                      [(ngModel)]="storeSettingsForm.company_phone"
                      placeholder="+91 90161 34899"
                    />
                  </div>
                  <div class="form-group">
                    <label style="font-weight: 700; color: #3A2E26;">Concierge Email</label>
                    <input
                      type="email"
                      [(ngModel)]="storeSettingsForm.company_email"
                      placeholder="info@aristatrinkets.com"
                    />
                  </div>
                </div>

                <div class="form-group" style="margin-top: 14px;">
                  <label style="font-weight: 700; color: #3A2E26;">Atelier Operating Hours / Timing</label>
                  <input
                    type="text"
                    [(ngModel)]="storeSettingsForm.company_timing"
                    placeholder="Mon – Sat: 10:00 AM – 7:00 PM IST"
                    style="width: 100%; padding: 10px; border: 1.5px solid #D1C7BD; border-radius: 8px; font-size: 0.88rem;"
                  />
                  <small style="color: #777; font-size: 0.74rem; margin-top: 4px; display: block;">
                    Displayed in the storefront footer, contact page, and concierge assistance.
                  </small>
                </div>
              </div>
            </div>

            <!-- CARD 2: DELIVERY & SHIPPING RULES -->
            <div style="background: #ffffff; border-radius: 12px; border: 1px solid #E8DFD5; box-shadow: 0 4px 15px rgba(0,0,0,0.03); padding: 24px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; border-bottom: 1.5px solid #F0E8DD; padding-bottom: 12px;">
                <span style="background: #E8F5E9; color: #2E7D32; font-weight: bold; font-size: 0.8rem; padding: 4px 10px; border-radius: 20px;">Shipping Rules</span>
                <h4 style="margin: 0; font-family: var(--font-serif); color: #3A2E26; font-size: 1.15rem;">Delivery Charge &amp; Free Threshold</h4>
              </div>

              <div class="product-form" style="margin-top: 0;">
                <div class="form-group" style="margin-bottom: 16px;">
                  <label style="font-weight: 700; color: #3A2E26;">Standard Delivery Charge (₹ INR) *</label>
                  <div style="position: relative;">
                    <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-weight: bold; color: #666;">₹</span>
                    <input
                      type="number"
                      [(ngModel)]="storeSettingsForm.delivery_charge"
                      min="0"
                      step="1"
                      placeholder="50"
                      style="padding-left: 28px;"
                    />
                  </div>
                  <small style="color: #777; font-size: 0.74rem; margin-top: 4px; display: block;">
                    Applied automatically to cart &amp; checkout when customer subtotal is below the free-delivery threshold.
                  </small>
                </div>

                <div class="form-group" style="margin-bottom: 16px;">
                  <label style="font-weight: 700; color: #3A2E26;">Free-Delivery Threshold (₹ INR) *</label>
                  <div style="position: relative;">
                    <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-weight: bold; color: #666;">₹</span>
                    <input
                      type="number"
                      [(ngModel)]="storeSettingsForm.free_delivery_threshold"
                      min="0"
                      step="10"
                      placeholder="600"
                      style="padding-left: 28px;"
                    />
                  </div>
                  <small style="color: #777; font-size: 0.74rem; margin-top: 4px; display: block;">
                    Orders with subtotal at or above this amount automatically receive <strong>FREE complimentary delivery</strong>!
                  </small>
                </div>



                <!-- Live Rule Simulation Box -->
                <div style="background: #FAF7F2; border: 1.5px dashed #D4AF37; border-radius: 8px; padding: 16px; margin-top: 20px;">
                  <div style="font-weight: 700; font-size: 0.85rem; color: #5B4636; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                    <span>✨</span> Live Customer Storefront Preview:
                  </div>
                  <div style="font-size: 0.82rem; color: #666; line-height: 1.5;">
                    • Subtotal under <strong>₹{{ storeSettingsForm.free_delivery_threshold || 600 }}</strong> &rarr; Customer pays <strong>₹{{ storeSettingsForm.delivery_charge || 50 }}</strong> shipping fee.<br/>
                    • Subtotal <strong>₹{{ storeSettingsForm.free_delivery_threshold || 600 }}</strong> or more &rarr; Customer receives <strong>FREE Delivery 🎉</strong>.<br/>
                    • Cart dynamically displays: <em>"Add ₹X more to unlock FREE delivery!"</em>
                  </div>
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
                <option value="" disabled selected>Select Category</option>
                <option *ngFor="let cat of categories" [value]="cat.name">{{ cat.name }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Price (₹ INR) *</label>
              <input type="number" [(ngModel)]="editingProduct.price" name="editPrice" (wheel)="preventNumberWheel($event)" required />
            </div>
            <div class="form-group">
              <label>Compare-At Price (₹ INR)</label>
              <input type="number" [(ngModel)]="editingProduct.compareAtPrice" name="editCompareAtPrice" (wheel)="preventNumberWheel($event)" />
              <span *ngIf="isPriceGreaterThanCompareAt(editingProduct.price, editingProduct.compareAtPrice)" style="color: #DC2626; font-size: 0.78rem; margin-top: 4px; display: block; font-weight: 600;">
                ⚠️ Price cannot be greater than Compare-At Price
              </span>
            </div>
            <div class="form-group">
              <label>Stock Quantity *</label>
              <input type="number" [(ngModel)]="editingProduct.stockQuantity" name="editStockQuantity" (wheel)="preventNumberWheel($event)" />
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
            <div class="form-group">
              <label>Storefront Visibility Status *</label>
              <select [(ngModel)]="editingProduct.isActive" name="editIsActive">
                <option [ngValue]="true">🟢 Active (Visible to Storefront Customers)</option>
                <option [ngValue]="false">🔴 Hidden (Hidden from Storefront Catalog)</option>
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
              <input type="number" [(ngModel)]="newProduct.price" name="price" placeholder="45000" (wheel)="preventNumberWheel($event)" required />
            </div>
            <div class="form-group">
              <label>Compare-At Original Price (₹ INR)</label>
              <input type="number" [(ngModel)]="newProduct.compareAtPrice" name="compareAtPrice" placeholder="52000" (wheel)="preventNumberWheel($event)" />
              <span *ngIf="isPriceGreaterThanCompareAt(newProduct.price, newProduct.compareAtPrice)" style="color: #DC2626; font-size: 0.78rem; margin-top: 4px; display: block; font-weight: 600;">
                ⚠️ Price cannot be greater than Compare-At Price
              </span>
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
            <div class="form-group">
              <label>Storefront Visibility Status *</label>
              <select [(ngModel)]="newProduct.isActive" name="newIsActive">
                <option [ngValue]="true">🟢 Active (Visible to Storefront Customers)</option>
                <option [ngValue]="false">🔴 Hidden (Hidden from Storefront Catalog)</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-top: 14px;">
            <label>Initial Stock Quantity</label>
            <input type="number" [(ngModel)]="newProduct.stockQuantity" name="stockQuantity" placeholder="10" (wheel)="preventNumberWheel($event)" />
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
            <button type="button" class="btn-cancel" (click)="closeAddProductModal()" [disabled]="isSavingProduct">Cancel</button>
            <button type="submit" class="btn-save" style="margin-top:0;" [disabled]="isSavingProduct">
              <span *ngIf="!isSavingProduct">+ Publish Product to Storefront</span>
              <span *ngIf="isSavingProduct">Publishing to Database...</span>
            </button>
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

    <!-- Order Status Change Confirmation Modal Overlay -->
    <div class="logout-modal-backdrop" *ngIf="pendingOrderStatusChange" (click)="cancelOrderStatusChange()">
      <div class="logout-modal-card" (click)="$event.stopPropagation()" style="max-width: 460px;">
        <div class="modal-icon-wrap" style="background: #FEF3C7; color: #D97706; border-color: #FCD34D;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        </div>

        <h3 class="modal-title">Confirm Order Status Change</h3>
        <p class="modal-desc" style="margin-bottom: 16px;">
          Are you sure you want to update the fulfillment status for Order <strong style="color: var(--brand-mocha-brown);">#{{ pendingOrderStatusChange.order.order_number || pendingOrderStatusChange.order.number }}</strong>?
        </p>

        <!-- Details Box -->
        <div style="background: #FAF7F2; border: 1px solid #E8DFD5; border-radius: 8px; padding: 14px; margin-bottom: 20px; text-align: left;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px;">
            <span style="color: #666;">Customer:</span>
            <strong style="color: #333;">{{ pendingOrderStatusChange.order.customer_name || pendingOrderStatusChange.order.customer }}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #E2D9CF;">
            <span style="color: #666;">Status Transition:</span>
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.8rem;">
              <span style="background: #E5E7EB; color: #374151; padding: 3px 8px; border-radius: 4px;">{{ pendingOrderStatusChange.oldStatus }}</span>
              <span>➔</span>
              <span style="background: #DBEAFE; color: #1E40AF; padding: 3px 8px; border-radius: 4px;">{{ pendingOrderStatusChange.targetStatus }}</span>
            </div>
          </div>
          <div *ngIf="pendingOrderStatusChange.targetStatus === 'DELIVERED' && (pendingOrderStatusChange.order.payment_method === 'COD' || pendingOrderStatusChange.order.paymentMethod === 'COD')" style="margin-top: 10px; padding: 8px 10px; background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 6px; font-size: 0.78rem; color: #065F46;">
            💵 <strong>Cash on Delivery:</strong> Marking as Delivered automatically records payment status as <strong>PAID</strong> (revenue collected).
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="modal-btn-cancel" (click)="cancelOrderStatusChange()">Cancel</button>
          <button type="button" class="modal-btn-confirm" (click)="confirmOrderStatusChange()">
            Confirm &amp; Update Status
          </button>
        </div>
      </div>
    </div>

    <!-- ORDER ITEMS DETAILS MODAL OVERLAY POPUP (ROOT LEVEL) -->
    <div *ngIf="selectedOrderForDetails" class="modal-backdrop" (click)="selectedOrderForDetails = null">
      <div class="modal-card" style="max-width: 680px;" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div>
            <h2 class="form-title" style="margin:0; font-size: 1.25rem;">
              Order Details (#{{ selectedOrderForDetails.order_number || selectedOrderForDetails.number }})
            </h2>
            <div style="font-size: 0.78rem; color: #888; margin-top: 3px;">
              Placed on {{ selectedOrderForDetails.ordered_at || selectedOrderForDetails.created_at }}
            </div>
          </div>
          <button type="button" class="btn-close" (click)="selectedOrderForDetails = null" title="Close Popup">&times;</button>
        </div>

        <div style="margin-top: 16px;">
          <!-- Prominent Order Cancellation Box if CANCELLED -->
          <div *ngIf="(selectedOrderForDetails.order_status || selectedOrderForDetails.status) === 'CANCELLED'" 
               style="background: #FFF5F5; border: 1px solid #FEB2B2; border-left: 4px solid #E53E3E; border-radius: var(--radius-sm); padding: 14px 16px; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
              <span style="font-weight: 700; color: #C53030; font-size: 0.92rem; display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 1.15rem;">🚫</span> ORDER CANCELLED
              </span>
              <span *ngIf="selectedOrderForDetails.cancelled_at" style="font-size: 0.78rem; color: #742A2A; font-weight: 600; background: #FED7D7; padding: 2px 8px; border-radius: 4px;">
                Cancelled: {{ selectedOrderForDetails.cancelled_at }}
              </span>
            </div>
            <div style="font-size: 0.85rem; color: #2D3748; line-height: 1.5;">
              <div>
                <strong style="color: #4A5568;">Reason Provided by Customer:</strong>
                <div style="margin-top: 5px; padding: 10px 14px; background: #FFFFFF; border: 1px dashed #FEB2B2; border-radius: 6px; color: #9B2C2C; font-weight: 600; font-size: 0.9rem;">
                  "{{ selectedOrderForDetails.cancellation_reason || selectedOrderForDetails.cancellationReason || 'No specific cancellation reason provided.' }}"
                </div>
              </div>
              <div style="margin-top: 8px; font-size: 0.78rem; color: #718096; display: flex; align-items: center; gap: 8px;">
                <span><strong>Cancelled by:</strong> {{ (selectedOrderForDetails.cancelled_by || selectedOrderForDetails.cancelledBy) === 'CUSTOMER' ? 'Customer (Self-service via Account Portal)' : ((selectedOrderForDetails.cancelled_by || selectedOrderForDetails.cancelledBy) || 'Customer') }}</span>
              </div>
            </div>
          </div>

          <!-- Customer & Shipping Summary Card -->
          <div style="background: var(--brand-pearl-beige); padding: 14px 16px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 0.85rem; display: flex; flex-direction: column; gap: 6px;">
            <div><strong>Customer:</strong> {{ selectedOrderForDetails.customer_name || selectedOrderForDetails.customer }} ({{ selectedOrderForDetails.customer_email || selectedOrderForDetails.email }})</div>
            <div *ngIf="selectedOrderForDetails.customer_phone"><strong>Phone:</strong> {{ selectedOrderForDetails.customer_phone }}</div>
            <div><strong>Shipping Address:</strong> {{ selectedOrderForDetails.shipping_address }}, {{ selectedOrderForDetails.city }}, {{ selectedOrderForDetails.state }} - {{ selectedOrderForDetails.pincode }}</div>
            <div *ngIf="selectedOrderForDetails.tracking_code"><strong>Tracking Code:</strong> <code style="color: var(--brand-warm-gold); font-weight: bold; background: #FFF; padding: 2px 6px; border-radius: 3px;">{{ selectedOrderForDetails.tracking_code }}</code></div>
            <div><strong>Payment Method:</strong> {{ selectedOrderForDetails.payment_method || selectedOrderForDetails.paymentMethod }} ({{ selectedOrderForDetails.payment_status || selectedOrderForDetails.paymentStatus }})</div>
          </div>

          <!-- Status Progress Timeline with Timestamps -->
          <h4 style="font-family: var(--font-serif); color: var(--brand-mocha-brown); margin: 16px 0 10px 0; font-size: 1rem;">Fulfillment Status Timeline:</h4>
          <div style="background: #FFFFFF; border: 1px solid var(--color-border); padding: 14px; border-radius: var(--radius-sm); margin-bottom: 16px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px;">
              <div style="padding: 8px 10px; border-radius: 6px; background: #FAF7F2; border-left: 3px solid #CFA874;">
                <span style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: #888; display: block;">1. Placed</span>
                <strong style="font-size: 0.78rem; color: var(--brand-mocha-brown); display: block;">{{ selectedOrderForDetails.ordered_at || selectedOrderForDetails.created_at }}</strong>
              </div>
              <div style="padding: 8px 10px; border-radius: 6px; background: #FAF7F2;" [style.border-left]="selectedOrderForDetails.processing_at ? '3px solid #9C27B0' : '3px solid #E0E0E0'">
                <span style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: #888; display: block;">2. In Progress</span>
                <strong style="font-size: 0.78rem; color: var(--brand-mocha-brown); display: block;">{{ selectedOrderForDetails.processing_at || 'Pending' }}</strong>
              </div>
              <div style="padding: 8px 10px; border-radius: 6px; background: #FAF7F2;" [style.border-left]="selectedOrderForDetails.shipped_at ? '3px solid #0288D1' : '3px solid #E0E0E0'">
                <span style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: #888; display: block;">3. Shipped</span>
                <strong style="font-size: 0.78rem; color: var(--brand-mocha-brown); display: block;">{{ selectedOrderForDetails.shipped_at || 'Pending' }}</strong>
              </div>
              <div style="padding: 8px 10px; border-radius: 6px; background: #FAF7F2;" [style.border-left]="selectedOrderForDetails.delivered_at ? '3px solid #2E7D32' : '3px solid #E0E0E0'">
                <span style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: #888; display: block;">4. Delivered</span>
                <strong style="font-size: 0.78rem; color: var(--brand-mocha-brown); display: block;">{{ selectedOrderForDetails.delivered_at || 'Pending' }}</strong>
              </div>
              <div *ngIf="(selectedOrderForDetails.order_status || selectedOrderForDetails.status) === 'CANCELLED'"
                   style="padding: 8px 10px; border-radius: 6px; background: #FFF5F5; border-left: 3px solid #E53E3E;">
                <span style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: #E53E3E; display: block;">5. Cancelled</span>
                <strong style="font-size: 0.78rem; color: #C53030; display: block;">{{ selectedOrderForDetails.cancelled_at || 'Cancelled' }}</strong>
              </div>
            </div>
          </div>

          <h4 style="font-family: var(--font-serif); color: var(--brand-mocha-brown); margin-bottom: 10px; font-size: 1rem;">Itemized Products:</h4>
          <div class="table-responsive">
            <table class="admin-table" style="font-size: 0.85rem;">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Metal Type</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="!selectedOrderForDetails.items || selectedOrderForDetails.items.length === 0">
                  <td colspan="5" style="text-align: center; color: #888; padding: 16px;">No itemized details attached to order.</td>
                </tr>
                <tr *ngFor="let item of selectedOrderForDetails.items">
                  <td><strong>{{ item.product_name }}</strong></td>
                  <td>{{ item.metal_type || '18K Warm Gold' }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>₹{{ item.unit_price | number }}</td>
                  <td><strong style="color: var(--brand-warm-gold);">₹{{ item.total_price | number }}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--color-border);">
            <span style="font-weight: 600;">Total Order Amount:</span>
            <strong style="font-size: 1.25rem; color: var(--brand-warm-gold);">₹{{ (selectedOrderForDetails.total_amount || selectedOrderForDetails.total) | number }}</strong>
          </div>
        </div>

        <div class="modal-footer" style="margin-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <a
            *ngIf="selectedOrderForDetails"
            [href]="getInvoicePdfUrl(selectedOrderForDetails)"
            target="_blank"
            class="btn-save"
            style="margin: 0; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; font-size: 0.85rem;"
          >
            📄 Download Official Tax Invoice (PDF)
          </a>
          <button type="button" class="btn-cancel" (click)="selectedOrderForDetails = null">Close Details</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .logout-modal-backdrop {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 999999 !important;
      background: rgba(26, 18, 11, 0.75) !important;
      backdrop-filter: blur(5px) !important;
      -webkit-backdrop-filter: blur(5px) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 20px !important;
      box-sizing: border-box !important;
      margin: 0 !important;
      animation: fadeIn 0.2s ease-out;
    }

    .logout-modal-card {
      background: #FFFFFF !important;
      border: 1px solid var(--color-border) !important;
      border-radius: var(--radius-md) !important;
      padding: 32px 28px !important;
      max-width: 440px !important;
      width: 100% !important;
      text-align: center !important;
      margin: auto !important;
      position: relative !important;
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.3) !important;
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

    /* Refined Atelier Luxury Notification Toast */
    .toast-notification-wrap {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 999999;
      pointer-events: none;
      animation: toastSlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes toastSlideIn {
      from {
        opacity: 0;
        transform: translateY(-12px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .toast-card {
      pointer-events: auto;
      background: #FFFFFF;
      color: #1F2937;
      border-radius: 12px;
      padding: 13px 16px 13px 16px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      min-width: 320px;
      max-width: min(460px, calc(100vw - 32px));
      box-shadow: 0 14px 38px rgba(44, 34, 28, 0.16), 0 4px 12px rgba(44, 34, 28, 0.08);
      border: 1px solid rgba(205, 162, 115, 0.28);
      position: relative;
      overflow: hidden;
    }

    .toast-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
    }

    .toast-card.success::before {
      background: #10B981;
    }

    .toast-card.error::before {
      background: #EF4444;
    }

    .toast-icon-box {
      flex-shrink: 0;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1px;
    }

    .toast-card.success .toast-icon-box {
      background: #ECFDF5;
      color: #059669;
    }

    .toast-card.error .toast-icon-box {
      background: #FEF2F2;
      color: #DC2626;
    }

    .toast-svg {
      width: 18px;
      height: 18px;
    }

    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-size: 0.86rem;
      font-weight: 700;
      color: #1A120B;
      margin-bottom: 2px;
      line-height: 1.3;
    }

    .toast-message {
      font-size: 0.82rem;
      color: #5B4636;
      line-height: 1.45;
      word-break: break-word;
      font-weight: 500;
    }

    .btn-close-toast {
      background: transparent;
      border: none;
      color: #9CA3AF;
      width: 26px;
      height: 26px;
      min-width: 26px;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.15s ease;
      padding: 0;
      margin-left: 2px;
    }

    .btn-close-toast:hover {
      background: #F3F4F6;
      color: #1F2937;
    }

    .close-icon-svg {
      width: 14px;
      height: 14px;
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

    .admin-container {
      max-width: 1440px !important;
      width: 98% !important;
      padding-left: 12px !important;
      padding-right: 12px !important;
    }

    .table-responsive {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow-x: auto;
      box-shadow: var(--shadow-sm);
    }

    .orders-table-wrapper {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      overflow-x: auto;
      width: 100%;
    }

    @media (min-width: 1024px) {
      .orders-table-wrapper {
        overflow-x: hidden;
      }
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .orders-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      table-layout: auto;
    }

    .orders-table th {
      background: var(--brand-pearl-beige);
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--brand-mocha-brown);
      padding: 10px 8px;
      border-bottom: 1px solid var(--color-border);
      white-space: nowrap;
    }

    .orders-table td {
      padding: 9px 8px;
      border-bottom: 1px solid var(--color-border);
      vertical-align: middle;
      font-size: 0.82rem;
    }

    .orders-table tbody tr:hover {
      background: #FAF8F5;
    }

    .btn-compact-action {
      border: 1px solid var(--color-border);
      background: #FAF7F2;
      color: var(--brand-mocha-brown);
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.74rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all var(--transition-fast);
      display: inline-flex;
      align-items: center;
      gap: 3px;
      text-decoration: none;
    }

    .btn-compact-action:hover {
      background: var(--brand-pearl-beige);
      border-color: var(--brand-warm-gold);
    }

    .btn-compact-action.invoice {
      background: #FFF9EE;
      color: #9E7422;
      border-color: #ECD8B6;
    }

    .btn-compact-action.invoice:hover {
      background: #FEF3DD;
    }

    .btn-mark-paid {
      border: 1px solid #A7F3D0;
      background: #ECFDF5;
      color: #065F46;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.68rem;
      font-weight: 700;
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
    }

    .btn-mark-paid:hover {
      background: #10B981;
      color: #FFFFFF;
    }

    .status-select-compact {
      padding: 4px 6px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-size: 0.76rem;
      font-weight: 600;
      color: var(--brand-mocha-brown);
      background: #FFFFFF;
      width: 100%;
      max-width: 110px;
      cursor: pointer;
    }

    .admin-table th {
      background: var(--brand-pearl-beige);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--brand-mocha-brown);
      padding: 14px 16px;
      border-bottom: 1px solid var(--color-border);
      white-space: nowrap;
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
    .item-price { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-weight: 700; color: var(--brand-mocha-brown); }
    .item-compare { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; text-decoration: line-through; color: var(--color-text-muted); font-size: 0.85rem; }

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
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(0, 0, 0, 0.65) !important;
      backdrop-filter: blur(4px) !important;
      -webkit-backdrop-filter: blur(4px) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 999999 !important;
      padding: 16px !important;
      margin: 0 !important;
      box-sizing: border-box !important;
    }

    .modal-card {
      background: #FFFFFF !important;
      border-radius: var(--radius-md) !important;
      width: 100% !important;
      max-width: 680px !important;
      max-height: calc(100vh - 40px) !important;
      overflow-y: auto !important;
      margin: auto !important;
      padding: 28px !important;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25) !important;
      border: 1px solid var(--brand-warm-gold) !important;
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

    /* Pagination Bar Styles */
    .pagination-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 18px;
      padding: 14px 20px;
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      flex-wrap: wrap;
      gap: 12px;
      box-shadow: var(--shadow-sm);
    }
    .pagination-info {
      font-size: 0.85rem;
      color: #665C54;
    }
    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .page-size-selector {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.82rem;
      color: var(--brand-mocha-brown);
      margin-right: 8px;
    }
    .page-size-selector select {
      padding: 5px 10px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
      font-size: 0.82rem;
      background: #FAF7F2;
      color: var(--brand-mocha-brown);
      font-weight: 600;
      cursor: pointer;
    }
    .btn-page {
      background: #FAF7F2;
      border: 1px solid var(--color-border);
      color: var(--brand-mocha-brown);
      padding: 6px 14px;
      border-radius: 50px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-page:hover:not(:disabled) {
      background: var(--brand-warm-gold);
      color: #FFFFFF;
      border-color: var(--brand-warm-gold);
    }
    .btn-page:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .btn-page-num {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      color: var(--brand-mocha-brown);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 0.82rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-page-num:hover {
      border-color: var(--brand-warm-gold);
      color: var(--brand-warm-gold);
    }
    .btn-page-num.active {
      background: var(--brand-mocha-brown);
      border-color: var(--brand-mocha-brown);
      color: #FFFFFF;
      font-weight: 700;
    }
  `]
})
export class AdminComponent implements OnInit {
  defaultImage = DEFAULT_FALLBACK_IMAGE;
  activeTab: 'products' | 'add-product' | 'categories' | 'add-category' | 'orders' | 'credentials' | 'homepage-photos' | 'settings' = 'categories';

  storeSettingsForm = {
    gst_number: '24AAACA1234A1Z5',
    gst_percentage: 3.0,
    delivery_charge: 50.0,
    free_delivery_threshold: 600.0,
    company_name: 'Arista Trinkets',
    company_address: 'Studio 101, Jewel Arcade, Near City Centre, Surat, Gujarat - 395001',
    company_phone: '9016134899',
    company_email: 'info@aristatrinkets.com',
    company_timing: 'Mon – Sat: 10:00 AM – 7:00 PM IST',
    invoice_prefix: 'INV-'
  };
  isLoadingSettings: boolean = false;
  isSavingSettings: boolean = false;
  gstinValidationError: string = '';

  products: ProductCardData[] = [];
  categories: Category[] = [];
  successMessage: string = '';

  // ── Pagination State for Categories ──
  categoryCurrentPage: number = 1;
  categoryPageSize: number = 10;

  get pagedCategories(): Category[] {
    const start = (this.categoryCurrentPage - 1) * this.categoryPageSize;
    return this.categories.slice(start, start + this.categoryPageSize);
  }

  get categoryTotalPages(): number {
    return Math.ceil(this.categories.length / this.categoryPageSize) || 1;
  }

  get categoryPageNumbers(): number[] {
    const pages: number[] = [];
    const max = Math.max(this.categoryTotalPages, 1);
    for (let i = 1; i <= max; i++) {
      pages.push(i);
    }
    return pages;
  }

  setCategoryPage(page: number): void {
    if (page >= 1 && page <= this.categoryTotalPages) {
      this.categoryCurrentPage = page;
    }
  }

  onCategoryPageSizeChange(): void {
    this.categoryCurrentPage = 1;
  }

  // ── Pagination State for Products ──
  productCurrentPage: number = 1;
  productPageSize: number = 10;

  productFilterVisibility: string = 'all';

  get activeProductsCount(): number {
    return (this.products || []).filter(p => p.available !== false && (p as any).isActive !== false).length;
  }

  get inactiveProductsCount(): number {
    return (this.products || []).filter(p => p.available === false || (p as any).isActive === false).length;
  }

  get filteredProducts(): ProductCardData[] {
    if (this.productFilterVisibility === 'active') {
      return (this.products || []).filter(p => p.available !== false && (p as any).isActive !== false);
    } else if (this.productFilterVisibility === 'inactive') {
      return (this.products || []).filter(p => p.available === false || (p as any).isActive === false);
    }
    return this.products || [];
  }

  get pagedProducts(): ProductCardData[] {
    const start = (this.productCurrentPage - 1) * this.productPageSize;
    return this.filteredProducts.slice(start, start + this.productPageSize);
  }

  get productTotalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.productPageSize) || 1;
  }

  async toggleProductActiveStatus(product: any): Promise<void> {
    const isCurrentlyActive = product.available !== false && product.isActive !== false;
    const newStatus = !isCurrentlyActive;
    const actionLabel = newStatus ? 'published to storefront' : 'hidden from storefront';

    try {
      const token = this.authService.getToken();
      await fetch(API_ENDPOINTS.ADMIN.PRODUCT_BY_ID(product.id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...product,
          available: newStatus,
          isActive: newStatus
        })
      });
    } catch (err) { }

    product.available = newStatus;
    product.isActive = newStatus;

    this.mockDataService.updateProduct(product.id, {
      available: newStatus,
      isActive: newStatus
    } as any);

    this.showToast(`Product "${product.name}" is now ${actionLabel}.`, 'success');
    this.cdr.detectChanges();
  }

  get productPageNumbers(): number[] {
    const pages: number[] = [];
    const max = Math.max(this.productTotalPages, 1);
    for (let i = 1; i <= max; i++) {
      pages.push(i);
    }
    return pages;
  }

  setProductPage(page: number): void {
    if (page >= 1 && page <= this.productTotalPages) {
      this.productCurrentPage = page;
    }
  }

  onProductPageSizeChange(): void {
    this.productCurrentPage = 1;
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  homepageEditorialPhoto: string = '/assets/images/editorial-artisanal-craft.jpg';
  newEditorialPhotoPreview: string = '';
  homepageSaveSuccess: string = '';
  homepageSaveError: string = '';
  isSavingHomepagePhoto: boolean = false;

  showAddProductModal: boolean = false;
  isSavingProduct: boolean = false;
  showAddCategoryModal: boolean = false;

  adminUser: any = null;
  showLogoutModal: boolean = false;
  deleteTarget: { type: 'product' | 'category' | 'user'; id: number | string; name: string } | null = null;
  pendingOrderStatusChange: { order: any; targetStatus: string; oldStatus: string; selectElem: HTMLSelectElement } | null = null;

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

  get lowStockCount(): number {
    if (!this.products || this.products.length === 0) return 0;
    return this.products.filter(p =>
      p.inStock === false ||
      (p as any).in_stock === 0 ||
      (p.stockQuantity !== undefined && p.stockQuantity !== null && Number(p.stockQuantity) <= 5)
    ).length;
  }

  newProduct = {
    name: '',
    category: '',
    price: '',
    compareAtPrice: '',
    badge: 'NEW',
    stockQuantity: '',
    isActive: true,
    image: '',
    images: [] as string[],
    description: '',
    materialsStr: '18K Warm Gold, Sterling Silver, Rose Gold',
    careGuide: 'Handle with care. Store in protective velvet pouch after use. Avoid contact with perfumes and hairsprays.',
    shippingInfo: 'Complimentary insured express delivery within 3-5 business days.',
    specifications: [
      { label: 'Craftsmanship', value: 'Demi Fine, Anti Tarnish Finish' },
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

  ordersList: any[] = [];
  isLoadingOrders: boolean = false;
  orderFilterStatus: string = '';
  orderFilterPaymentStatus: string = '';
  orderFilterDateFrom: string = '';
  orderFilterDateTo: string = '';
  orderSearchQuery: string = '';
  selectedOrderForDetails: any = null;

  orderSummaryMetrics = {
    totalRevenue: 0,
    paidRevenue: 0,
    pendingRevenue: 0,
    cancelledRevenue: 0
  };

  orderCurrentPage: number = 1;
  orderPageSize: number = 10;
  orderTotalItems: number = 0;
  orderTotalPages: number = 1;

  get orderPageNumbers(): number[] {
    const pages: number[] = [];
    const max = Math.max(this.orderTotalPages, 1);
    for (let i = 1; i <= max; i++) {
      pages.push(i);
    }
    return pages;
  }

  setOrderPage(page: number): void {
    if (page >= 1 && page <= this.orderTotalPages) {
      this.loadAdminOrders(page);
    }
  }

  onOrderPageSizeChange(): void {
    this.loadAdminOrders(1);
  }

  async loadAdminOrders(page: number = this.orderCurrentPage): Promise<void> {
    this.orderCurrentPage = page;
    this.isLoadingOrders = true;
    try {
      const offset = (page - 1) * this.orderPageSize;
      const params = new URLSearchParams();
      params.append('limit', String(this.orderPageSize));
      params.append('offset', String(offset));

      if (this.orderFilterStatus) params.append('status', this.orderFilterStatus);
      if (this.orderFilterPaymentStatus) params.append('paymentStatus', this.orderFilterPaymentStatus);
      if (this.orderFilterDateFrom) params.append('dateFrom', this.orderFilterDateFrom);
      if (this.orderFilterDateTo) params.append('dateTo', this.orderFilterDateTo);
      if (this.orderSearchQuery.trim()) params.append('search', this.orderSearchQuery.trim());

      const token = this.authService.getToken();
      const res = await fetch(`${API_ENDPOINTS.ADMIN.DASHBOARD.replace('/dashboard', '/orders')}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data && data.success && data.data && data.data.orders) {
        this.ordersList = data.data.orders;
        if (data.data.summary) {
          this.orderSummaryMetrics = {
            totalRevenue: Number(data.data.summary.totalRevenue) || 0,
            paidRevenue: Number(data.data.summary.paidRevenue) || 0,
            pendingRevenue: Number(data.data.summary.pendingRevenue) || 0,
            cancelledRevenue: Number(data.data.summary.cancelledRevenue) || 0
          };
        } else {
          this.calculateOrderMetricsFromList();
        }
        if (data.data.pagination) {
          this.orderTotalItems = data.data.pagination.total || 0;
          this.orderTotalPages = data.data.pagination.pages || Math.ceil(this.orderTotalItems / this.orderPageSize) || 1;
        }
      } else {
        this.ordersList = [];
        this.orderTotalItems = 0;
        this.orderTotalPages = 1;
        this.calculateOrderMetricsFromList();
      }
    } catch (err) {
      this.ordersList = [];
      this.orderTotalItems = 0;
      this.orderTotalPages = 1;
      this.calculateOrderMetricsFromList();
    } finally {
      this.isLoadingOrders = false;
      this.cdr.detectChanges();
    }
  }

  calculateOrderMetricsFromList(): void {
    const total = this.ordersList.reduce((acc, o) => acc + (Number(o.total_amount || o.total) || 0), 0);
    const paid = this.ordersList
      .filter(o => (o.payment_status || o.paymentStatus) === 'PAID')
      .reduce((acc, o) => acc + (Number(o.total_amount || o.total) || 0), 0);
    const pending = this.ordersList
      .filter(o => (o.payment_status || o.paymentStatus) === 'PENDING')
      .reduce((acc, o) => acc + (Number(o.total_amount || o.total) || 0), 0);
    const cancelled = this.ordersList
      .filter(o => (o.order_status || o.status) === 'CANCELLED')
      .reduce((acc, o) => acc + (Number(o.total_amount || o.total) || 0), 0);

    this.orderSummaryMetrics = {
      totalRevenue: total,
      paidRevenue: paid,
      pendingRevenue: pending,
      cancelledRevenue: cancelled
    };
  }

  resetOrderFilters(): void {
    this.orderFilterStatus = '';
    this.orderFilterPaymentStatus = '';
    this.orderFilterDateFrom = '';
    this.orderFilterDateTo = '';
    this.orderSearchQuery = '';
    this.orderCurrentPage = 1;
    this.loadAdminOrders(1);
  }

  promptChangeOrderStatus(order: any, event: Event): void {
    const selectElem = event.target as HTMLSelectElement;
    const targetStatus = selectElem.value;
    const oldStatus = order.order_status || order.status;

    if (targetStatus === oldStatus) return;

    // Revert visual selection back to old status until user confirms in modal
    selectElem.value = oldStatus;

    this.pendingOrderStatusChange = {
      order,
      targetStatus,
      oldStatus,
      selectElem
    };
    this.cdr.detectChanges();
  }

  cancelOrderStatusChange(): void {
    if (this.pendingOrderStatusChange) {
      this.pendingOrderStatusChange.selectElem.value = this.pendingOrderStatusChange.oldStatus;
      this.pendingOrderStatusChange = null;
      this.cdr.detectChanges();
    }
  }

  async confirmOrderStatusChange(): Promise<void> {
    if (!this.pendingOrderStatusChange) return;

    const { order, targetStatus, selectElem } = this.pendingOrderStatusChange;
    this.pendingOrderStatusChange = null;

    const orderId = order.id || order.order_number;
    if (!orderId) return;

    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN.ORDER_STATUS(orderId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: targetStatus, orderStatus: targetStatus })
      });
      const data = await res.json();
      if (data && data.success) {
        order.order_status = targetStatus;
        order.status = targetStatus;
        if (data.data?.paymentStatus) {
          order.payment_status = data.data.paymentStatus;
          order.paymentStatus = data.data.paymentStatus;
        } else if (targetStatus === 'DELIVERED' && (order.payment_method === 'COD' || order.paymentMethod === 'COD')) {
          order.payment_status = 'PAID';
          order.paymentStatus = 'PAID';
        }
        selectElem.value = targetStatus;
        this.showToast(`Order #${order.order_number || order.number} status updated to ${targetStatus}!`, 'success');
        this.loadAdminOrders();
      } else {
        selectElem.value = order.order_status || order.status;
        this.showToast(data?.message || 'Failed to update order status.', 'error');
      }
    } catch (err: any) {
      selectElem.value = order.order_status || order.status;
      this.showToast(`Error updating order status: ${err.message}`, 'error');
    }
    this.cdr.detectChanges();
  }

  async toggleOrderPaymentStatus(order: any, targetPaymentStatus: string): Promise<void> {
    const orderId = order.id || order.order_number;
    if (!orderId) return;

    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN.ORDER_PAYMENT_STATUS(orderId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: targetPaymentStatus })
      });
      const data = await res.json();
      if (data && data.success) {
        order.payment_status = targetPaymentStatus;
        order.paymentStatus = targetPaymentStatus;
        this.showToast(`Order #${order.order_number || order.number} payment marked as ${targetPaymentStatus}!`, 'success');
        this.loadAdminOrders();
      } else {
        this.showToast(data?.message || 'Failed to update payment status.', 'error');
      }
    } catch (err: any) {
      this.showToast(`Error updating payment status: ${err.message}`, 'error');
    }
    this.cdr.detectChanges();
  }

  mockOrders: any[] = [];

  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  toastTitle: string = '';
  toastTimeout: any = null;

  dismissToast(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    this.toastMessage = '';
    this.cdr.detectChanges();
  }

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private mockDataService = inject(MockDataService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private settingsService = inject(SettingsService);

  showToast(message: string, type: 'success' | 'error' = 'success', title?: string): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastTitle = title || (type === 'success' ? 'Success' : 'Notice');
    this.cdr.detectChanges();

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.dismissToast();
    }, 4500);
  }

  @HostListener('wheel', ['$event'])
  onWheelScroll(event: WheelEvent): void {
    if (document.activeElement instanceof HTMLInputElement && document.activeElement.type === 'number') {
      document.activeElement.blur();
    }
  }

  preventNumberWheel(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      event.target.blur();
    }
  }

  ngOnInit(): void {
    this.adminUser = this.authService.currentUser();
    if (this.adminUser) {
      this.profileForm.name = this.adminUser.name || 'Admin User';
      this.profileForm.email = this.adminUser.email || '';
    }

    this.loadAdminUsers();
    this.loadAdminOrders();
    this.loadStoreSettings();
    this.loadAdminProducts();
    this.loadAdminCategories();
    this.loadHomepageConfig();
  }

  loadAdminProducts(): void {
    this.productService.getAdminProducts().subscribe({
      next: (prods) => {
        const uniqueProdsMap = new Map<string, ProductCardData>();
        prods.forEach(p => {
          let img = p.image ? p.image.trim() : '';
          if (img && !img.startsWith('http') && !img.startsWith('data:') && !img.startsWith('/')) {
            img = '/' + img;
          }
          const item: ProductCardData = {
            ...p,
            image: img || this.defaultImage
          };
          const key = String(item.id || item.slug);
          if (!uniqueProdsMap.has(key)) {
            uniqueProdsMap.set(key, item);
          }
        });
        this.products = Array.from(uniqueProdsMap.values());
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load admin products from database:', err);
      }
    });
  }

  loadAdminCategories(): void {
    this.categoryService.getCategories(true).subscribe({
      next: (cats) => {
        this.categories = cats;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load admin categories from database:', err);
      }
    });
  }

  getInvoicePdfUrl(order: any): string {
    if (!order) return '#';
    const orderNumber = order.order_number || order.orderNumber || order.id;
    return API_ENDPOINTS.ORDERS.INVOICE_PDF(orderNumber);
  }

  validateGstinInput(): void {
    if (!this.storeSettingsForm.gst_number) {
      this.gstinValidationError = 'GSTIN is required.';
      return;
    }
    const clean = this.storeSettingsForm.gst_number.trim().toUpperCase();
    this.storeSettingsForm.gst_number = clean;
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstinRegex.test(clean)) {
      this.gstinValidationError = 'Invalid Indian GSTIN format (e.g. 24AAACA1234A1Z5).';
    } else {
      this.gstinValidationError = '';
    }
  }

  async loadStoreSettings(): Promise<void> {
    this.isLoadingSettings = true;
    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN.SETTINGS, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (this.checkAuthError(res, data)) return;
      if (data && data.success && data.data) {
        this.storeSettingsForm = {
          gst_number: data.data.gst_number || '24AAACA1234A1Z5',
          gst_percentage: Number(data.data.gst_percentage) !== undefined ? Number(data.data.gst_percentage) : 3.0,
          delivery_charge: Number(data.data.delivery_charge) !== undefined ? Number(data.data.delivery_charge) : 50.0,
          free_delivery_threshold: Number(data.data.free_delivery_threshold) !== undefined ? Number(data.data.free_delivery_threshold) : 600.0,
          company_name: data.data.company_name || data.data.companyName || 'Arista Trinkets',
          company_address: data.data.company_address || data.data.companyAddress || 'Studio 101, Jewel Arcade, Near City Centre, Surat, Gujarat - 395001',
          company_phone: data.data.company_phone || data.data.companyPhone || '9016134899',
          company_email: data.data.company_email || data.data.companyEmail || 'info@aristatrinkets.com',
          company_timing: data.data.company_timing || data.data.companyTiming || 'Mon – Sat: 10:00 AM – 7:00 PM IST',
          invoice_prefix: data.data.invoice_prefix || data.data.invoicePrefix || 'INV-'
        };
        this.validateGstinInput();
      }
    } catch (err: any) {
      this.showToast(`Failed to load store settings: ${err.message}`, 'error');
    } finally {
      this.isLoadingSettings = false;
      this.cdr.detectChanges();
    }
  }

  async saveStoreSettings(): Promise<void> {
    this.validateGstinInput();
    if (this.gstinValidationError) {
      this.showToast('Please fix the GSTIN validation error before saving.', 'error');
      return;
    }

    if (!this.storeSettingsForm.company_name?.trim()) {
      this.showToast('Company name is required for legal invoices.', 'error');
      return;
    }

    if (this.storeSettingsForm.delivery_charge < 0 || this.storeSettingsForm.free_delivery_threshold < 0) {
      this.showToast('Delivery fee and free threshold cannot be negative.', 'error');
      return;
    }

    this.isSavingSettings = true;
    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN.SETTINGS, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(this.storeSettingsForm)
      });
      const data = await res.json();
      if (this.checkAuthError(res, data)) return;
      if (data && data.success) {
        this.showToast('Settings saved successfully! Changes are now live.', 'success');
        this.settingsService.fetchSettings();
      } else {
        this.showToast(data?.message || 'Failed to save settings.', 'error');
      }
    } catch (err: any) {
      this.showToast(`Failed to save settings: ${err.message}`, 'error');
    } finally {
      this.isSavingSettings = false;
      this.cdr.detectChanges();
    }
  }

  loadHomepageConfig(): void {
    fetch(API_ENDPOINTS.HOMEPAGE_CONFIG)
      .then(res => res.json())
      .then(data => {
        if (data?.success && data?.data?.editorial_photo) {
          this.homepageEditorialPhoto = data.data.editorial_photo;
          this.cdr.detectChanges();
        }
      })
      .catch(err => console.error('Error fetching homepage config:', err));
  }

  onEditorialPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newEditorialPhotoPreview = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  private checkAuthError(res: Response, data?: any): boolean {
    if (this.authService.checkUnauthorized(res, data)) {
      this.showToast('Your session has expired. Please log in again.');
      this.router.navigate(['/admin/login'], { queryParams: { reason: 'session_expired' } });
      return true;
    }
    return false;
  }

  saveEditorialPhoto(): void {
    const photoToSave = this.newEditorialPhotoPreview || this.homepageEditorialPhoto;
    if (!photoToSave) return;

    this.isSavingHomepagePhoto = true;
    this.homepageSaveSuccess = '';
    this.homepageSaveError = '';

    const token = this.authService.getToken() || localStorage.getItem('arista_auth_token') || '';

    if (!token) {
      this.isSavingHomepagePhoto = false;
      this.authService.logout();
      this.router.navigate(['/admin/login'], { queryParams: { reason: 'session_expired' } });
      return;
    }

    fetch(API_ENDPOINTS.ADMIN.HOMEPAGE_CONFIG, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        sectionKey: 'editorial_photo',
        image: photoToSave
      })
    })
      .then(async res => {
        const data = await res.json();
        this.isSavingHomepagePhoto = false;
        if (this.checkAuthError(res, data)) {
          return;
        }
        if (data.success) {
          this.homepageEditorialPhoto = photoToSave;
          this.newEditorialPhotoPreview = '';
          this.homepageSaveSuccess = 'Artisanal Excellence photo updated successfully!';
          this.showToast('Homepage photo updated successfully!');
          setTimeout(() => { this.homepageSaveSuccess = ''; }, 4000);
        } else {
          this.homepageSaveError = data.message || 'Failed to update photo.';
        }
        this.cdr.detectChanges();
      })
      .catch(err => {
        this.isSavingHomepagePhoto = false;
        // Fallback local update
        this.homepageEditorialPhoto = photoToSave;
        this.newEditorialPhotoPreview = '';
        this.homepageSaveSuccess = 'Artisanal Excellence photo updated successfully!';
        this.showToast('Homepage photo updated successfully!');
        setTimeout(() => { this.homepageSaveSuccess = ''; }, 4000);
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
        { label: 'Craftsmanship', value: 'Demi Fine, Anti Tarnish Finish' },
        { label: 'Certification', value: 'BIS Hallmarked Gold' }
      ];
    }

    const rawStock = (product.stockQuantity !== undefined && product.stockQuantity !== null && product.stockQuantity !== '')
      ? Number(product.stockQuantity)
      : ((product.stock_quantity !== undefined && product.stock_quantity !== null && product.stock_quantity !== '')
        ? Number(product.stock_quantity)
        : 0);

    const isOutOfStock = product.inStock === false || (product as any).in_stock === 0 || rawStock <= 0;
    const finalStockQty = isOutOfStock ? 0 : rawStock;

    const isProductActive = product.isActive !== false && product.available !== false && (product as any).is_active !== 0;

    this.editingProduct = {
      id: product.id,
      name: product.name,
      category: product.category || (this.categories.length > 0 ? this.categories[0].name : ''),
      price: product.price,
      compareAtPrice: product.compareAtPrice || null,
      badge: product.badge || '',
      image: img || (imagesList.length > 0 ? imagesList[0] : ''),
      images: imagesList,
      stockQuantity: finalStockQty,
      isActive: isProductActive,
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
    if (this.isPriceGreaterThanCompareAt(this.editingProduct.price, this.editingProduct.compareAtPrice)) {
      this.showToast('Product Price (₹ INR) cannot be greater than Compare-At Price (₹ INR).', 'error');
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

    const stockQty = (this.editingProduct.stockQuantity !== undefined && this.editingProduct.stockQuantity !== null && this.editingProduct.stockQuantity !== '')
      ? Math.max(0, Number(this.editingProduct.stockQuantity))
      : 0;
    const isStockValid = stockQty > 0;

    const isProductActive = this.editingProduct.isActive !== false;

    const payload = {
      ...this.editingProduct,
      name: this.editingProduct.name.trim(),
      price: Number(this.editingProduct.price),
      inStock: isStockValid,
      stockQuantity: stockQty,
      available: isProductActive,
      isActive: isProductActive,
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
      if (this.checkAuthError(res, data)) return;
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
      inStock: isStockValid,
      stockQuantity: stockQty,
      available: isProductActive,
      isActive: isProductActive,
      description: this.editingProduct.description ? this.editingProduct.description.trim() : '',
      materials: materialsArray,
      careGuide: this.editingProduct.careGuide || '',
      shippingInfo: this.editingProduct.shippingInfo || '',
      specifications: validSpecs
    } as any);

    // Update product in local state
    const index = this.products.findIndex(p => String(p.id) === String(this.editingProduct.id) || p.slug === this.editingProduct.slug);
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        name: this.editingProduct.name.trim(),
        category: this.editingProduct.category,
        price: Number(this.editingProduct.price),
        compareAtPrice: this.editingProduct.compareAtPrice ? Number(this.editingProduct.compareAtPrice) : undefined,
        badge: (this.editingProduct.badge as any) || undefined,
        image: finalImage,
        images: imagesList,
        inStock: isStockValid,
        stockQuantity: stockQty,
        available: isProductActive,
        isActive: isProductActive
      };
    }

    // CLOSE POPUP MODAL IMMEDIATELY
    this.closeEditModal();

    // SHOW API RESPONSE AS TOAST NOTIFICATION
    this.showToast(notificationMsg, isSuccess ? 'success' : 'error');
  }

  async saveProduct(event: Event): Promise<void> {
    event.preventDefault();

    if (this.isSavingProduct) return;

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
    if (this.isPriceGreaterThanCompareAt(this.newProduct.price, this.newProduct.compareAtPrice)) {
      this.showToast('Product Price (₹ INR) cannot be greater than Compare-At Price (₹ INR).', 'error');
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

    this.isSavingProduct = true;
    this.cdr.detectChanges();

    this.productService.createProduct(payload).subscribe({
      next: (res) => {
        this.isSavingProduct = false;
        if (res && res.success && res.data && res.data.id) {
          const createdName = payload.name;
          this.closeAddProductModal();
          this.showToast(`Jewellery creation "${createdName}" published to catalog!`, 'success');
          this.loadAdminProducts();
        } else {
          this.showToast(res?.message || 'Failed to create product in database.', 'error');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSavingProduct = false;
        if (err.status === 401 || err.status === 403) {
          this.showToast('Your session has expired. Please log in again.', 'error');
          this.router.navigate(['/admin/login'], { queryParams: { reason: 'session_expired' } });
          this.cdr.detectChanges();
          return;
        }
        const errorMsg = err.error?.message || (err.status === 0 ? 'Network error: Cannot reach the backend server. Please verify your connection.' : 'Failed to publish product to database.');
        this.showToast(errorMsg, 'error');
        this.cdr.detectChanges();
      }
    });
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
      if (this.checkAuthError(res, data)) return;
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
      console.error('Failed to load admin users from database:', err);
    }
    this.createdAdminUsers = [];
    this.cdr.detectChanges();
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
      if (this.checkAuthError(res, data)) return;

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
      if (this.checkAuthError(res, data)) return;
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
      const res = await fetch(API_ENDPOINTS.ADMIN.USER_BY_ID(adminId), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (this.checkAuthError(res, data)) return;
      if (data && data.success) {
        this.showToast(`Admin user account "${adminName}" revoked and removed.`, 'success');
        this.loadAdminUsers();
      } else {
        this.showToast(data?.message || 'Failed to remove admin user.', 'error');
      }
    } catch (err: any) {
      this.showToast(`Error deleting admin user: ${err.message}`, 'error');
    }
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
        const res = await fetch(API_ENDPOINTS.ADMIN.PRODUCT_BY_ID(id), {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (this.checkAuthError(res, data)) return;
      } catch (err) {
        // Offline fallback
      }

      this.products = this.products.filter(p => String(p.id) !== targetStr);
      this.mockDataService.deleteProduct(id);
      this.showToast(`Jewellery product "${name}" deleted from catalog.`, 'success');
      this.cdr.detectChanges();
    } else if (type === 'category') {
      const cat = this.categories.find(c => String(c.id) === targetStr || c.slug === targetStr);
      const catName = cat ? cat.name : name;

      const assignedCount = (this.products || []).filter(p =>
        (catName && p.category?.toLowerCase() === catName.toLowerCase()) ||
        (cat && p.category?.toLowerCase() === cat.slug?.toLowerCase())
      ).length;

      if (assignedCount > 0) {
        this.showToast(`Cannot delete category "${catName}": ${assignedCount} product(s) are assigned to this category. Please reassign or delete the products first.`, 'error');
        this.cdr.detectChanges();
        return;
      }

      try {
        const token = this.authService.getToken();
        const res = await fetch(API_ENDPOINTS.ADMIN.CATEGORY_BY_ID(id), {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (this.checkAuthError(res, data)) return;
        if (data && !data.success) {
          this.showToast(data.message || `Cannot delete category "${catName}".`, 'error');
          this.cdr.detectChanges();
          return;
        }
      } catch (err) {
        // Offline fallback
      }

      try {
        this.mockDataService.deleteCategory(id);
      } catch (mockErr: any) {
        this.showToast(mockErr.message || `Cannot delete category "${catName}".`, 'error');
        this.cdr.detectChanges();
        return;
      }

      this.categories = this.categories.filter(c => String(c.id) !== targetStr && c.slug !== targetStr);
      this.showToast(`Category "${catName}" removed from catalog.`, 'success');
      this.cdr.detectChanges();
    } else if (type === 'user') {
      try {
        const token = this.authService.getToken();
        const res = await fetch(API_ENDPOINTS.ADMIN.USER_BY_ID(id), {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (this.checkAuthError(res, data)) return;
        if (data && data.success) {
          this.showToast(`Admin user account "${name}" revoked and removed.`, 'success');
          this.loadAdminUsers();
        } else {
          this.showToast(data?.message || 'Failed to remove admin user.', 'error');
        }
      } catch (err: any) {
        this.showToast(`Error deleting admin user: ${err.message}`, 'error');
      }
    }
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
      if (this.checkAuthError(res, data)) return;
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
      isActive: true,
      image: '',
      images: [],
      description: '',
      materialsStr: '18K Warm Gold, Sterling Silver, Rose Gold',
      careGuide: 'Handle with care. Store in protective velvet pouch after use.',
      shippingInfo: 'Complimentary insured express delivery within 3-5 business days.',
      specifications: [
        { label: 'Craftsmanship', value: 'Demi Fine, Anti Tarnish Finish' },
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
    const targetStr = String(id);
    const cat = this.categories.find(c => String(c.id) === targetStr || c.slug === targetStr);
    const name = cat ? cat.name : `ID ${id}`;

    const assignedCount = (this.products || []).filter(p =>
      (cat && p.category?.toLowerCase() === cat.name.toLowerCase()) ||
      (cat && p.category?.toLowerCase() === cat.slug.toLowerCase())
    ).length;

    if (assignedCount > 0) {
      this.showToast(`Cannot delete category "${name}": ${assignedCount} product(s) are assigned to this category. Please reassign or delete the products first.`, 'error');
      return;
    }

    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN.CATEGORY_BY_ID(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (this.checkAuthError(res, data)) return;
      if (data && !data.success) {
        this.showToast(data.message || `Cannot delete category "${name}".`, 'error');
        return;
      }
    } catch (err) {
      // Offline fallback
    }

    try {
      this.mockDataService.deleteCategory(id);
    } catch (mockErr: any) {
      this.showToast(mockErr.message || `Cannot delete category "${name}".`, 'error');
      return;
    }

    this.categories = this.categories.filter(c => String(c.id) !== targetStr && c.slug !== targetStr);
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
      if (this.checkAuthError(res, data)) return;
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

  isPriceGreaterThanCompareAt(price: any, compareAtPrice: any): boolean {
    if (compareAtPrice === '' || compareAtPrice === null || compareAtPrice === undefined) {
      return false;
    }
    const p = Number(price);
    const cap = Number(compareAtPrice);
    return !isNaN(p) && !isNaN(cap) && cap > 0 && p > cap;
  }

  getDiscountPercentage(product: any): number {
    if (
      product &&
      product.compareAtPrice !== undefined &&
      product.compareAtPrice !== null &&
      Number(product.compareAtPrice) > Number(product.price) &&
      Number(product.compareAtPrice) > 0
    ) {
      const price = Number(product.price) || 0;
      const compareAtPrice = Number(product.compareAtPrice) || 0;
      const savings = compareAtPrice - price;
      return Math.round((savings / compareAtPrice) * 100);
    }
    return 0;
  }
}
