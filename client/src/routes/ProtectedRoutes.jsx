import { Navigate, useLocation } from "react-router";

export const PrivateRoutes = ({ children, accessToken, user }) => {
  const location = useLocation(); // ✅ Fixed

  if (!accessToken) {
    return (
      <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
    );
  }

  // Redirect unverified users to verify page
  if (user && !user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

export const PublicRoutes = ({ children, accessToken }) => {
  const location = useLocation();

  if (accessToken) {
    return <Navigate to={location.state?.from || "/"} replace />;
  }

  return children;
};

export const VerifyRoutes = ({ children, accessToken, user }) => {
  const location = useLocation(); // ✅ Also corrected here just in case

  if (!accessToken) {
    return (
      <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
    );
  }

  // If user is already verified, redirect to home
  if (user && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};
