import Link from "next/link";

const Navbar = () => {
  return (
    <nav>
      <Link href="/login">Login</Link>
      <Link href="/signup">Sign Up</Link>
    </nav>
  );
};

export default Navbar;
