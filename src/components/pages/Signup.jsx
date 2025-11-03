import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useContext } from 'react';
import { AuthContext } from '../../App';

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isInitialized } = useContext(AuthContext);
  
  useEffect(() => {
    if (isInitialized) {
      // Show signup UI in this component
      const { ApperUI } = window.ApperSDK;
      ApperUI.showSignup("#authentication");
    }
  }, [isInitialized]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-surface-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-surface-800 dark:text-surface-100">Create Account</h1>
          <p className="mt-2 text-surface-600 dark:text-surface-400">Sign up for your account</p>
        </div>
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary to-primary-dark text-white text-2xl 2xl:text-3xl font-bold">
            S
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold">
              Create Account
            </div>
            <div className="text-center text-sm text-gray-500">
              Please create an account to continue
            </div>
          </div>
        </div>
        <div id="authentication" />
        <div className="text-center mt-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;