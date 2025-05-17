
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="auth-background">
      <div className="container relative flex flex-col items-center justify-center">
        <Link to="/" className="absolute top-8 left-8 flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-white font-bold">A</div>
          <span className="logo-text">AuthApp</span>
        </Link>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
