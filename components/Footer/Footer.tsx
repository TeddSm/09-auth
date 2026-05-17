import css from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Mykhailo Drogobetskyi</p>
          <p>
            Contact us:{" "}
            <a href="mailto:mishanydr@gmail.com">Mishanyadr@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};