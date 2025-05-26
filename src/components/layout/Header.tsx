import AppLogo from './AppLogo';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <AppLogo />
        {/* Navigation items can be added here if needed */}
      </div>
    </header>
  );
};

export default Header;
