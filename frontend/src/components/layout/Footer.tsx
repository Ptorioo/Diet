const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        <p className="mt-1">Made with ❤️</p>
      </div>
    </footer>
  );
};

export default Footer;
