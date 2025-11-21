import { NavLink } from "react-router-dom";

const BottomNav = () => {
  const buildClass = ({ isActive }) =>
    "bottom-nav__item" + (isActive ? " bottom-nav__item--active" : "");

  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={buildClass}>
        <span>Home</span>
        <span className="bottom-nav__dot" />
      </NavLink>

      <NavLink to="/categories" className={buildClass}>
        <span>Kategori</span>
        <span className="bottom-nav__dot" />
      </NavLink>

      <NavLink to="/bookmarks" className={buildClass}>
        <span>Bookmark</span>
        <span className="bottom-nav__dot" />
      </NavLink>

      <NavLink to="/profile" className={buildClass}>
        <span>Profil</span>
        <span className="bottom-nav__dot" />
      </NavLink>
    </nav>
  );
};

export default BottomNav;
