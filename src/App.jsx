// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import Barcode from "react-barcode";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import SalesHistory from "./pages/SaleHistory"; // your file (expects props: sales, onBack)

// ---------- Helpers ----------
const currency = (v) => `₹${Number(v || 0).toFixed(2)}`;
const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const LS_PRODUCTS = "ag_products";
const LS_SALES = "ag_sales";

const readLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const writeLS = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

// ---------- Styles ----------
const primaryBtn = {
  background: "#b91c1c",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
};
const navBtn = {
  background: "transparent",
  color: "#fff",
  border: "1px solid #444",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
};
const card = {
  background: "#111",
  border: "1px solid #1f1f1f",
  color: "#fff",
  padding: 14,
  borderRadius: 10,
};
const inputStyle = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #2b2b2b",
  background: "white",
  color: "black",
  width: "100%",
};

// ---------- Header (uses useNavigate inside Router) ----------
function Header() {
  const navigate = useNavigate();
  return (
    <header style={{ background: "#000", color: "#fff", borderBottom: "2px solid #b91c1c" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.png" alt="logo" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Alankar Garments</div>
            <div style={{ fontSize: 12, color: "#ddd" }}>Simple POS</div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 8 }}>
          <button style={navBtn} onClick={() => navigate("/")}>Dashboard</button>
          <button style={primaryBtn} onClick={() => navigate("/add")}>Add Product</button>
          <button style={navBtn} onClick={() => navigate("/inventory")}>Inventory</button>
          <button style={navBtn} onClick={() => navigate("/cart")}>Cart</button>
          <button style={navBtn} onClick={() => navigate("/sales-history")}>Sales History</button>
        </nav>
      </div>
    </header>
  );
}

// ---------- Dashboard ----------
function Dashboard({ products }) {
  const totalValue = products.reduce((s, p) => s + Number(p.price || 0) * (p.stock || 0), 0);
  return (
    <div style={{ padding: 18 }}>
      <h2 style={{ color: "white" }}>Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginTop: 12 }}>
        <div style={card}>
          <div style={{ fontSize: 12, color: "#bbb" }}>Inventory Count</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{products.length}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 12, color: "#bbb" }}>Total Value</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{currency(totalValue)}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 12, color: "#bbb" }}>Quick</div>
          <div style={{ marginTop: 8 }}>
            {/* navigate to /cart via header Nav or router Link */}
            <button style={{ ...primaryBtn, padding: "6px 10px" }} onClick={() => (window.location.href = "/cart")}>New Sale</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Add Product ----------
function AddProductForm({ onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [sku, setSku] = useState("");

  const genSku = () => {
    if (!name || !price || !desc) {
      alert("Fill name, price and description first.");
      return;
    }
    setSku("AGR-" + Math.floor(100000 + Math.random() * 900000));
  };

  const add = () => {
    if (!name || !price || !sku) {
      alert("Fill name, price and generate SKU.");
      return;
    }
    const product = { id: uid(), name, price: Number(price), desc, sku, createdAt: Date.now(), stock: 1 };
    onAdd(product);
    setName(""); setPrice(""); setDesc(""); setSku("");
  };

  return (
    <div style={{ padding: 18 }}>
      <h3 style={{ color: "white" }}>Add Product</h3>
      <div style={{ maxWidth: 720, marginTop: 12, display: "grid", gap: 8 }}>
        <input placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" style={inputStyle} />
        <textarea placeholder="Short description" value={desc} onChange={(e) => setDesc(e.target.value)} style={{ ...inputStyle, minHeight: 80 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="SKU (generate)" value={sku} onChange={(e) => setSku(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
          <button onClick={genSku} style={primaryBtn}>Generate</button>
          <button onClick={add} style={primaryBtn}>Add</button>
        </div>

        {sku && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, color: "#ddd", marginBottom: 6 }}>Barcode preview</div>
            <div style={{ background: "white", padding: 8, display: "inline-block", borderRadius: 6 }}>
              <Barcode value={sku} format="CODE128" height={64} displayValue />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Inventory ----------
function Inventory({ products, onDelete, onPrint }) {
  return (
    <div style={{ padding: 18 }}>
      <h3 style={{ color: "white" }}>Inventory</h3>
      <div style={{ marginTop: 12 }}>
        {(!products || products.length === 0) ? (
          <div style={{ color: "#bbb" }}>No products yet</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {products.map((p) => (
              <div key={p.id} style={{ ...card, display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{p.name} <span style={{ color: "#aaa", fontSize: 12 }}>({p.sku})</span></div>
                  <div style={{ color: "#bbb" }}>{p.desc}</div>
                  <div style={{ marginTop: 8 }}>{currency(p.price)}</div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ background: "white", padding: 8, borderRadius: 6 }}>
                    <Barcode value={p.sku} height={48} displayValue={false} />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => onPrint(p)} style={primaryBtn}>Print Label</button>
                    <button onClick={() => onDelete(p.id)} style={{ ...navBtn, border: "1px solid #3b3b3b" }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Cart ----------
function Cart({ products, onSaleComplete }) {
  const [cart, setCart] = useState([]);
  const [scanValue, setScanValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addBySku = (sku) => {
    if (!sku) return;
    const prod = products.find((p) => p.sku === sku);
    if (!prod) {
      alert("Product not found: " + sku);
      return;
    }

    setCart((prev) => {
      const found = prev.find((i) => i.sku === sku);
      if (found)
        return prev.map((i) =>
          i.sku === sku ? { ...i, qty: i.qty + 1 } : i
        );
      return [{ ...prod, qty: 1 }, ...prev];
    });
  };

  const handleAddFromInput = () => {
    const code = scanValue.trim();
    if (!code) return;
    addBySku(code);
    setScanValue("");
    inputRef.current?.focus();
  };

  const onInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddFromInput();
    }
  };

  const removeItem = (sku) =>
    setCart((prev) => prev.filter((i) => i.sku !== sku));
  const changeQty = (sku, qty) =>
    setCart((prev) =>
      prev.map((i) =>
        i.sku === sku ? { ...i, qty: Math.max(1, qty) } : i
      )
    );

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const printReceipt = () => {
    if (!cart || cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    const date = new Date();
    const rows = cart
      .map(
        (i) =>
          `<tr><td>${i.name}</td><td style="text-align:center">${i.qty}</td><td style="text-align:right">${currency(
            i.price * i.qty
          )}</td></tr>`
      )
      .join("");

    // ✅ Embed logo as base64 so it always works
    const logoBase64 =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAA7CAYAAAB..." // shortened for clarity

    const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; color: #000; margin:0; padding:12px; }
          .center { text-align: center; }
          table { width:100%; border-collapse: collapse; margin-top:10px; }
          td, th { padding: 6px 0; font-size: 14px; }
          th { border-bottom: 1px solid #000; text-align:left; }
          tfoot td { border-top: 1px solid #000; font-weight:700; }
          @media print { @page { size: auto; margin: 6mm; } }
        </style>
      </head>
      <body>
        <div class="center">
<img 
  src="${window.location.origin}/logo.png" 
  alt="logo" 
  style="width:60px; height:auto; margin-bottom:6px;" 
/>
          <h2 style="margin:4px 0;">Alankar Garments</h2>
          <div style="font-size:12px; margin-bottom:6px;">${date.toLocaleString()}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align:left">Item</th>
              <th style="text-align:center">Qty</th>
              <th style="text-align:right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">Grand Total</td>
              <td style="text-align:right">${currency(total)}</td>
            </tr>
          </tfoot>
        </table>

        <script>
          window.addEventListener('load', function(){
            setTimeout(function(){ window.print(); }, 150);
            window.onafterprint = function(){ window.close(); };
          });
        </script>
      </body>
    </html>`;

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();

    // Save sale object
    const sale = {
      id: uid(),
      date: new Date().toISOString(),
      items: cart.map((i) => ({
        name: i.name,
        sku: i.sku,
        qty: i.qty,
        price: i.price,
      })),
      total,
    };
    onSaleComplete(sale);

    // clear cart
    setCart([]);
    inputRef.current?.focus();
  };

  return (
    <div style={{ padding: 18 }}>
      <h3 style={{ color: "white" }}>Cart / Billing</h3>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          ref={inputRef}
          value={scanValue}
          onChange={(e) => setScanValue(e.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="Scan or enter SKU then press Enter"
          style={inputStyle}
        />
        <button onClick={handleAddFromInput} style={primaryBtn}>
          Add
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={card}>
          {(!cart || cart.length === 0) ? (
            <div style={{ color: "#aaa" }}>Cart is empty</div>
          ) : (
            <>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {cart.map((item) => (
                  <li
                    key={item.sku}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: 8,
                      borderBottom: "1px solid #222",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: "#999" }}>
                        {item.sku}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div>{currency(item.price)}</div>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          alignItems: "center",
                          justifyContent: "flex-end",
                          marginTop: 6,
                        }}
                      >
                        <input
                          type="number"
                          value={item.qty}
                          min={1}
                          onChange={(e) =>
                            changeQty(item.sku, Number(e.target.value || 1))
                          }
                          style={{ width: 64, padding: 6, borderRadius: 6 }}
                        />
                        <button
                          onClick={() => removeItem(item.sku)}
                          style={{ ...navBtn, border: "1px solid #333" }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 12,
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  Total: {currency(total)}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setCart([])}
                    style={{ ...navBtn, border: "1px solid #333" }}
                  >
                    Cancel
                  </button>
                  <button onClick={printReceipt} style={primaryBtn}>
                    Print Receipt
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}



// ---------- Main App (wraps Router here) ----------
export default function App() {
  const [products, setProducts] = useState(() => readLS(LS_PRODUCTS, []));
  const [sales, setSales] = useState(() => readLS(LS_SALES, []));

  // Persist
  useEffect(() => writeLS(LS_PRODUCTS, products), [products]);
  useEffect(() => writeLS(LS_SALES, sales), [sales]);

  // On mount, remove sales older than 15 days
  useEffect(() => {
    setSales((prev) => {
      const cutoff = Date.now() - 15 * 24 * 60 * 60 * 1000;
      return prev.filter((s) => {
        const t = new Date(s.date).getTime();
        return !Number.isNaN(t) && t >= cutoff;
      });
    });
  }, []);

  const addProduct = (p) => setProducts((prev) => [p, ...prev]);
  const deleteProduct = (id) => setProducts((prev) => prev.filter((x) => x.id !== id));

  const printLabel = (product) => {
    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Label</title>
  <style>body{font-family:Arial;margin:6px;color:#000}.c{text-align:center}</style>
</head>
<body>
  <div class="c"><div style="font-weight:700;margin-bottom:6px;">${product.name}</div><div style="margin-bottom:6px;">${product.sku}</div><svg id="bc"></svg></div>
  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
  <script>window.addEventListener('load',function(){JsBarcode("#bc", ${JSON.stringify(product.sku)}, {format:"CODE128",displayValue:true,height:60}); setTimeout(()=>window.print(),150); window.onafterprint=function(){window.close()};});</script>
</body>
</html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  // When a sale completes (from Cart), append it and prune >15 days
  const handleSaleComplete = (sale) => {
    setSales((prev) => {
      const next = [sale, ...prev];
      const cutoff = Date.now() - 15 * 24 * 60 * 60 * 1000;
      return next.filter((s) => {
        const t = new Date(s.date).getTime();
        return !Number.isNaN(t) && t >= cutoff;
      });
    });
  };

  return (
    <Router>
      <div style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard products={products} />} />
            <Route path="/add" element={<AddProductForm onAdd={addProduct} />} />
            <Route path="/inventory" element={<Inventory products={products} onDelete={deleteProduct} onPrint={printLabel} />} />
            <Route path="/cart" element={<Cart products={products} onSaleComplete={handleSaleComplete} />} />
            <Route path="/sales-history" element={<SalesHistory sales={sales} onBack={() => window.history.back()} />} />
          </Routes>
        </main>
        <footer style={{ textAlign: "center", padding: 14, color: "#999" }}>POS • Alankar Garments</footer>
      </div>
    </Router>
  );
}
