'use client';

import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useState } from 'react';

export default function Newsletter() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock backend call
    // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify(data) });
    
    Swal.fire({
      icon: 'success',
      title: 'Subscribed!',
      text: 'Thanks for joining our newsletter!',
      timer: 1500,
    });
    
    reset();
    setIsLoading(false);
  };

  return (
    <section className="py-16 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl p-8 md:p-12 shadow-lg">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-base-content dark:text-base-content">
            Stay Updated
          </h2>
          <p className="mb-8 text-base-content/70 dark:text-base-content/70 text-lg">
            Get the latest listings and updates straight to your inbox. No spam, unsubscribe anytime.
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row justify-center items-stretch md:items-start gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  placeholder="Enter your email"
                  className="input input-bordered w-full h-14 px-5 text-lg bg-base-100 dark:bg-base-200 text-base-content dark:text-base-content rounded-xl shadow-sm"
                  disabled={isLoading}
                />
                {errors.email && (
                  <div className="absolute left-0 top-full mt-1 text-error text-sm">
                    {errors.email.message}
                  </div>
                )}
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary h-14 px-8 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center min-w-[140px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subscribing
                </div>
              ) : 'Subscribe'}
            </button>
          </form>
          
          <p className="mt-4 text-sm text-base-content/60 dark:text-base-content/60">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}