# SoleBazar: Complete Architectural & Implementation Prompt

This document provides a comprehensive, end-to-end prompt designed for Advanced Agentic AIs (like Gemini, Claude, or GPT-4) to recreate the **SoleBazar** project from scratch. It captures the full tech stack, data architecture, design system, and core logic.

---

## 🚀 The AI Prompt

**Task**: Generate a full-stack, premium sneaker marketplace application called "SoleBazar". The application must feature a high-end minimalist design, a robust Admin Dashboard, and seamless integration with Cloudinary for image management.

### 🛠️ Tech Stack & Requirements
- **Framework**: Next.js 15+ (App Router, TypeScript).
- **Database**: MongoDB with Prisma ORM.
- **Authentication**: NextAuth.js (Credentials Provider).
- **Styling**: Tailwind CSS (v4) with custom branding.
- **Images**: Cloudinary (Signed Uploads, `next-cloudinary`).
- **Smooth Scroll**: Lenis Smooth Scroll.
- **Animations**: GSAP, Framer Motion, Lucide icons.
- **Drag & Drop**: `@dnd-kit/core` & `@dnd-kit/sortable` for image reordering.

---

### 📂 Folder Structure Map
Implement the following architecture:
```text
/src
  /app
    /(authenticated)      # Admin protected routes
      /admin
        /products
          /[id]/page.tsx  # Edit Product
          /new/page.tsx   # Add Product
          /page.tsx       # Product List
        /orders/page.tsx  # Order Management (Trash/Soft Delete supported)
        /dashboard/page.tsx
    /api
      /cloudinary/sign    # Secure upload signing
      /admin              # Product/Order CRUD APIs
    /products             # Public shop routes
    /product/[slug]       # Public product details
    /layout.tsx           # Global Providers & SEO
  /components
    /admin                # CloudinaryUpload, SortableImage, Sidebar
    /ui                   # Hero, Shop, Gallery, ProductCard, Modals
    /providers.tsx        # Session, Lenis, Toast providers
  /lib
    /prisma.ts            # Client singleton
    /utils.ts             # Tailwind merging & helper functions
  /prisma
    /schema.prisma        # MongoDB Data Models
```

---

### 💾 Data Architecture (Prisma Schema)
Implement these models:
1. **Admin**: id, email, password (hashed), name.
2. **Brand / Category**: id, name, slug, icon (relation to Products).
3. **Product**: 
   - Fields: Name, Slug, Description, Price, CompareAt, Condition (New/Pre-loved), Stock, Gender, Featured, isTopPick.
   - Complex Fields: `sizes` & `colors` stored as JSON strings.
4. **ProductImage**: id, url, order (Int), relation to Product.
5. **Order / OrderItem**:
   - Order: customerName, phone, email, address, status (pending/shipped/etc), total, isDeleted (Soft delete).
   - OrderItem: productId, size, color, price, quantity.
6. **Setting**: siteName, SiteDescription, SMTP details, Social links.
7. **AnalyticsEvent**: eventType (page_view, purchase, etc), productId, sessionId, timestamp.

---

### 🎨 Design System & Aesthetics
- **Theme**: "Brutalist Premium" - Bold headings, high-contrast, heavy borders with smooth glassmorphism.
- **Colors**:
  - Sage/Olive: `#7C8C5C` (Primary Action)
  - Cream/Tan: `#E8DCC8` (Secondary / Earthy borders)
  - Charcoal: `#2B2B2B` (Depth / Dark UI)
  - Bone White: `#FAFAF7` (Main Background)
- **Typography**: Poppins (Weights 400, 500, 600, 700, 900).
- **Core UI Elements**:
  - **Preloader**: A fixed Sage-green "SB" logo box with a progress bar that fades out on hydration.
  - **Glassmorphism**: Use `backdrop-blur-md` with `bg-white/50` or `bg-black/50` for cards and overlays.
  - **Rounded Edges**: Large `32px` or `40px` radiuses for cards and sections.

---

### 🧠 Core Business Logic
1. **Cloudinary Signed Upload**:
   - Backend: POST route `/api/cloudinary/sign` using `cloudinary.utils.api_sign_request` and `CLOUDINARY_API_SECRET_KEY`.
   - Frontend: `CldUploadWidget` wrapped in a custom button. It must pass the signature to Cloudinary.
2. **Visual Gallery Control**:
   - Create a grid-based gallery where images can be **dragged to reorder**.
   - Final `order` property must be saved to the `ProductImage` table.
3. **Admin Soft Delete**:
   - Orders are marked as `isDeleted` instead of permanent removal.
   - Implement a "Trash View" in the admin dashboard to restore or purge orders.
4. **Client Experience**:
   - **Lenis Provider**: Wrap everything in smooth scrolling.
   - **Order Modal**: A premium floating slide-over or modal for quick checkouts with size/color selection.
   - **Seo & Metadata**: Dynamic generation of meta tags in `layout.tsx` based on the `Setting` model.

---

### 🔑 Environment Constants
Provide a template `.env` for:
`MONGODB_URL`, `NEXTAUTH_SECRET`, `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_API_SECRET_KEY`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

---

**Execution Goal**: Start by building the Prisma Schema and API routes, then move to the Admin UI, and finally the Public Storefront. Ensure all components use the provided color palette and maintain the Sage/Cream/Charcoal aesthetic.
