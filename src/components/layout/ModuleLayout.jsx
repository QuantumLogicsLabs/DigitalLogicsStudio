import React from "react";
import { NavLink } from "react-router-dom";
import MainLayout from "./MainLayout";
import homeData from "../../pages/Home/HomeData";

const ModuleLayout = ({ children, title, subtitle }) => {
  // Find the module that contains the current page
  const currentPath = window.location.pathname;
  const module = homeData.find(m => 
    m.links.some(link => link.to === currentPath)
  );

  const sidebarContent = module ? (
    <div className="module-sidebar">
      <div className="afhdl-sidebar-card">
        <p className="afhdl-sidebar-kicker">Learning Path</p>
        <h2 className="afhdl-sidebar-title" style={{ fontSize: '1.2rem', margin: '0.4rem 0' }}>
          {module.title.replace(/[^\w\s&]/g, '').trim()}
        </h2>
        <p className="afhdl-sidebar-copy" style={{ fontSize: '0.85rem' }}>
          {module.description}
        </p>
      </div>

      <nav className="afhdl-sidebar-nav" style={{ marginTop: '1.5rem' }}>
        {module.links.map((link, index) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `afhdl-nav-item${isActive ? " is-active" : ""}`
            }
          >
            <span className="afhdl-nav-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="afhdl-nav-copy">
              <span className="afhdl-nav-label">{link.text}</span>
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  ) : null;

  return (
    <MainLayout 
      title={title} 
      subtitle={subtitle} 
      moduleName={module ? module.title.replace(/[^\w\s&]/g, '').trim() : "Digital Logics Studio"}
      sidebarContent={sidebarContent}
    >
      {children}
    </MainLayout>
  );
};

export default ModuleLayout;
