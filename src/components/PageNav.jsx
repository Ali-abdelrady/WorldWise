import { Link, NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
export default function PageNav() {
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <img src="/public/logo.png" alt="" style={{ width: "30%" }} />
      </Link>
      <ul>
        <li>
          <NavLink to={"/pricing"}>Pricing</NavLink>
        </li>
        <li>
          <NavLink to={"/product"}>Product</NavLink>
        </li>
        <li>
          <NavLink to={"/login"} className="cta">
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
