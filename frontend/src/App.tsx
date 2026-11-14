import EnquiryForm from "./components/EnquiryForm";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
import {
  api,
  type Product,
  type CategoryProducts
} from "./services/api";
import "./App.css";

function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p className="price">${product.price.toFixed(2)}</p>
      <p>⭐ {product.rating.rate} / 5</p>
    </Link>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p>No matching products found.</p>;
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFeatured()
      .then(setProducts)
      .catch(() => setError("Unable to load featured products."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <section className="hero">
        <h1>Discover products you'll love</h1>
        <p>Explore our catalogue and enquire about your favourites.</p>
      </section>

      <h2>Featured Products</h2>
      {loading ? <p>Loading products...</p> :
        error ? <p role="alert">{error}</p> :
        <ProductGrid products={products} />}
    </main>
  );
}


function CategoryPage() {
  const { category = "" } = useParams();
  const [state, setState] = useState<{
    category: string;
    data: CategoryProducts | null;
    error: string;
  }>({
    category: "",
    data: null,
    error: ""
  });

  useEffect(() => {
    let active = true;

    api.getCategoryProducts(category)
      .then(result => {
        if (active) {
          setState({
            category,
            data: result,
            error: ""
          });
        }
      })
      .catch(() => {
        if (active) {
          setState({
            category,
            data: null,
            error: "Unable to load this category."
          });
        }
      });

    return () => {
      active = false;
    };
  }, [category]);

  const loading = state.category !== category;

  return (
    <main>
      <h1>Category: {category}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : state.error ? (
        <p role="alert">{state.error}</p>
      ) : state.data && (
        <>
          <h2>Top Rated</h2>
          <ProductGrid products={state.data.topRated} />
          <h2>More Products</h2>
          <ProductGrid products={state.data.additional} />
        </>
      )}
    </main>
  );
}



function SearchPage() {
  const [params] = useSearchParams();
  const term = params.get("q") || "";

  const [state, setState] = useState<{
    term: string;
    products: Product[];
    error: string;
  }>({
    term: "",
    products: [],
    error: ""
  });

  useEffect(() => {
    let active = true;

    api.searchProducts(term)
      .then(result => {
        if (active) {
          setState({
            term,
            products: result,
            error: ""
          });
        }
      })
      .catch(() => {
        if (active) {
          setState({
            term,
            products: [],
            error: "Search failed. Please try again."
          });
        }
      });

    return () => {
      active = false;
    };
  }, [term]);

  const loading = state.term !== term;

  return (
    <main>
      <h1>Search results for "{term}"</h1>
      {loading ? (
        <p>Searching...</p>
      ) : state.error ? (
        <p role="alert">{state.error}</p>
      ) : (
        <ProductGrid products={state.products} />
      )}
    </main>
  );
}


function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEnquiry, setShowEnquiry] = useState(false);

  useEffect(() => {
    let active = true;
    //setLoading(true);
    //setError("");

    // Temporary implementation until the detail API is added.
    api.getProducts()
      .then(products => {
        if (active) {
          setProduct(products.find(p => p.id === Number(id)) || null);
        }
      })
      .catch(() => {
        if (active) setError("Unable to load product details.");
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [id]);

  if (loading) return <main><p>Loading product...</p></main>;
  if (error) return <main><p role="alert">{error}</p></main>;
  if (!product) return <main><h1>Product not found</h1></main>;

  return (
    <main className="product-detail">
      <img src={product.image} alt={product.title} />
      <div>
        <Link to="/">← Back to catalogue</Link>
        <h1>{product.title}</h1>
        <p className="price">${product.price.toFixed(2)}</p>
        <p>⭐ {product.rating.rate} / 5</p>
        <p>{product.description}</p>
{showEnquiry ? (
  <EnquiryForm
    product={product}
    onCancel={() => setShowEnquiry(false)}
  />
) : (
  <button
    type="button"
    onClick={() => setShowEnquiry(true)}
  >
    Enquire Now
  </button>
)}
      </div>
    </main>
  );
}

function Navigation() {
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <header className="site-header">
      <nav className="top-nav">
        <Link to="/" className="logo">ShopExplore</Link>
        <form onSubmit={event => {
          event.preventDefault();
          if (search.trim()) {
            navigate(`/search?q=${encodeURIComponent(search.trim())}`);
          }
        }}>
          <input
            aria-label="Search products"
            placeholder="Search products..."
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </nav>

      <div className="category-nav">
        <Link to="/">Home</Link>
        {categories.map(category => (
          <Link
            key={category}
            to={`/categories/${encodeURIComponent(category)}`}
          >
            {category}
          </Link>
        ))}
      </div>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories/:category" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="*" element={<main><h1>Page not found</h1></main>} />
      </Routes>
      <footer>© 2026 ShopExplore · Product Catalogue PoC</footer>
    </BrowserRouter>
  );
}

export default App;
