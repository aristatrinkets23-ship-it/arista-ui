import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/mock/mock-data.service';
import { ProductCardData } from '../../core/models/product-card-data.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- Admin Top Header Banner -->
    <section class="admin-hero">
      <div class="container hero-content">
        <div>
          <span class="hero-eyebrow">Atelier Back-Office</span>
          <h1 class="hero-title">Arista Trinkets Management Console</h1>
        </div>
        <a routerLink="/" class="btn-storefront">&larr; Return to Customer Storefront</a>
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
                    <img [src]="item.image" [alt]="item.name" class="table-img" />
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
                      <button type="button" class="btn-action edit" (click)="editProduct(item)">Edit</button>
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
                  <label>Product Name</label>
                  <input type="text" [(ngModel)]="newProduct.name" name="name" placeholder="e.g. Royal Heritage Ruby Pendant" required />
                </div>
                <div class="form-group">
                  <label>Category</label>
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
                  <label>Price (₹ INR)</label>
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

              <div class="form-row">
                <div class="form-group">
                  <label>Image Source / Asset Path</label>
                  <select [(ngModel)]="newProduct.image" name="image" required>
                    <option value="/assets/images/placeholder-rings.svg">Rings Vector Asset (/assets/images/placeholder-rings.svg)</option>
                    <option value="/assets/images/placeholder-necklaces.svg">Necklaces Vector Asset (/assets/images/placeholder-necklaces.svg)</option>
                    <option value="/assets/images/placeholder-earrings.svg">Earrings Vector Asset (/assets/images/placeholder-earrings.svg)</option>
                    <option value="/assets/images/placeholder-bracelets.svg">Bracelets Vector Asset (/assets/images/placeholder-bracelets.svg)</option>
                    <option value="/assets/images/placeholder-jewellery.svg">Jewellery Generic Asset (/assets/images/placeholder-jewellery.svg)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Initial Stock Quantity</label>
                  <input type="number" [(ngModel)]="newProduct.stockQuantity" name="stockQuantity" placeholder="10" />
                </div>
              </div>

              <div class="form-group">
                <label>Product Description & Atelier Craft Notes</label>
                <textarea rows="4" [(ngModel)]="newProduct.description" name="description" placeholder="Describe the gold karatage, diamond clarity, craftsmanship, and design details..."></textarea>
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
      </div>
    </section>
  `,
  styles: [`
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
      margin: 0;
    }

    .btn-storefront {
      color: var(--brand-warm-gold);
      font-weight: 600;
      text-decoration: none;
      font-size: 0.88rem;
      border: 1px solid var(--brand-warm-gold);
      padding: 8px 16px;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }

    .btn-storefront:hover {
      background: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
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

    .admin-tabs {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      border-bottom: 2px solid var(--color-border);
      padding-bottom: 2px;
      overflow-x: auto;
    }

    .tab-btn {
      background: transparent;
      border: none;
      font-family: var(--font-sans);
      font-weight: 600;
      font-size: 0.92rem;
      color: var(--color-text-muted);
      padding: 12px 20px;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      white-space: nowrap;
    }

    .tab-btn.active {
      color: var(--brand-mocha-brown);
      border-bottom-color: var(--brand-warm-gold);
      background: #FFFFFF;
      border-radius: var(--radius-sm) var(--radius-sm) 0 0;
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
      width: 44px;
      height: 44px;
      object-fit: cover;
      border-radius: var(--radius-sm);
      background: var(--brand-pearl-beige);
    }

    .item-name {
      display: block;
      color: var(--brand-mocha-brown);
    }

    .item-category {
      font-size: 0.78rem;
      color: var(--color-text-muted);
    }

    .item-price {
      color: var(--brand-mocha-brown);
    }

    .item-compare {
      text-decoration: line-through;
      color: var(--color-text-muted);
      font-size: 0.85rem;
    }

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

    .stock-pill.in-stock {
      background: #E8F5E9;
      color: #2E7D32;
    }

    .stock-pill.out-stock {
      background: #FFEBEE;
      color: #C62828;
    }

    .action-btns {
      display: flex;
      gap: 8px;
    }

    .btn-action {
      border: none;
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-action.edit {
      background: var(--brand-pearl-beige);
      color: var(--brand-mocha-brown);
    }

    .btn-action.delete {
      background: #FFEBEE;
      color: #C62828;
    }

    .form-card {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 28px;
      max-width: 800px;
      margin: 0 auto;
      box-shadow: var(--shadow-sm);
    }

    .form-title {
      font-family: var(--font-serif);
      color: var(--brand-mocha-brown);
      font-size: 1.5rem;
      margin-bottom: 20px;
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

    .product-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    @media (min-width: 768px) {
      .form-row { grid-template-columns: repeat(2, 1fr); }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

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

    .btn-save {
      background-color: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 16px;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 0.92rem;
      margin-top: 12px;
    }

    .btn-save:hover {
      background-color: #E2B882;
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
  `]
})
export class AdminComponent implements OnInit {
  activeTab: 'products' | 'add-product' | 'orders' = 'products';
  products: ProductCardData[] = [];
  successMessage: string = '';

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

  private mockDataService = inject(MockDataService);

  ngOnInit(): void {
    this.mockDataService.getProducts().subscribe(prods => {
      this.products = prods;
    });
  }

  async saveProduct(event: Event): Promise<void> {
    event.preventDefault();

    if (!this.newProduct.name || !this.newProduct.price) return;

    try {
      await fetch('http://localhost:5000/api/v1/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.newProduct)
      });
    } catch (err) {
      // Ignored non-critical offline fallback
    }

    const createdItem: ProductCardData = {
      id: Date.now(),
      name: this.newProduct.name,
      slug: this.newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: this.newProduct.category,
      price: Number(this.newProduct.price),
      compareAtPrice: this.newProduct.compareAtPrice ? Number(this.newProduct.compareAtPrice) : undefined,
      badge: (this.newProduct.badge as 'NEW' | 'SALE' | 'FEATURED' | 'BESTSELLER') || undefined,
      image: this.newProduct.image,
      available: true
    };

    this.products = [createdItem, ...this.products];
    this.successMessage = `Jewellery creation "${this.newProduct.name}" published successfully to catalog!`;

    setTimeout(() => {
      this.successMessage = '';
      this.activeTab = 'products';
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

  editProduct(product: ProductCardData): void {
    alert(`Editing product ID ${product.id}: ${product.name}`);
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to remove this product from catalog?')) {
      this.products = this.products.filter(p => p.id !== productId);
    }
  }

  updateOrderStatus(order: any, event: Event): void {
    const select = event.target as HTMLSelectElement;
    order.status = select.value;
  }
}
