import React from 'react';

// Example component showing how to use SoCal Wellness brand colors
const BrandColorShowcase = () => {
  return (
    <div className="p-8 space-y-8">
      {/* Header Example */}
      <section>
        <h2 className="text-2xl font-bold text-socal-gray-900 mb-4">Brand Color Usage Examples</h2>
        
        {/* Primary Colors */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-socal-gray-800 mb-3">Primary Colors</h3>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-socal-primary rounded-lg shadow-md mb-2"></div>
              <p className="text-sm text-socal-gray-600">Primary</p>
              <p className="text-xs text-socal-gray-400">#001E40</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-socal-primary-dark rounded-lg shadow-md mb-2"></div>
              <p className="text-sm text-socal-gray-600">Primary Dark</p>
              <p className="text-xs text-socal-gray-400">#012650</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-socal-accent rounded-lg shadow-md mb-2"></div>
              <p className="text-sm text-socal-gray-600">Accent</p>
              <p className="text-xs text-socal-gray-400">#5B8FA8</p>
            </div>
          </div>
        </div>

        {/* Button Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-socal-gray-800 mb-3">Buttons</h3>
          <div className="flex gap-4">
            <button className="bg-socal-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-socal-primary-dark transition-colors">
              Primary Button
            </button>
            <button className="bg-socal-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-socal-accent-dark transition-colors">
              Accent Button
            </button>
            <button className="border-2 border-socal-primary text-socal-primary px-6 py-3 rounded-lg font-semibold hover:bg-socal-primary hover:text-white transition-all">
              Secondary Button
            </button>
          </div>
        </div>

        {/* Card Example */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-socal-gray-800 mb-3">Service Card</h3>
          <div className="max-w-sm">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-socal-primary to-socal-accent"></div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-socal-gray-900 mb-2">Medical Weight Loss</h4>
                <p className="text-socal-gray-600 mb-4">
                  Personalized weight management programs designed to help you achieve your health goals.
                </p>
                <button className="text-socal-accent font-semibold hover:text-socal-accent-dark">
                  Learn More →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Typography Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-socal-gray-800 mb-3">Typography</h3>
          <h1 className="text-4xl font-bold text-socal-gray-900 mb-2">Heading 1</h1>
          <h2 className="text-3xl font-bold text-socal-gray-800 mb-2">Heading 2</h2>
          <p className="text-socal-gray-600 mb-2">Body text in gray-600</p>
          <p className="text-socal-gray-400">Muted text in gray-400</p>
        </div>

        {/* Alert Examples */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-socal-gray-800 mb-3">Alerts</h3>
          <div className="bg-socal-success/10 border border-socal-success text-socal-success p-4 rounded-lg">
            Success message
          </div>
          <div className="bg-socal-warning/10 border border-socal-warning text-socal-warning p-4 rounded-lg">
            Warning message
          </div>
          <div className="bg-socal-error/10 border border-socal-error text-socal-error p-4 rounded-lg">
            Error message
          </div>
          <div className="bg-socal-info/10 border border-socal-info text-socal-info p-4 rounded-lg">
            Info message
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandColorShowcase;

// Usage in Tailwind classes:
// bg-socal-primary - Primary navy background
// text-socal-primary - Primary navy text
// border-socal-primary - Primary navy border
// bg-socal-accent - Accent blue background
// text-socal-gray-600 - Gray text
// hover:bg-socal-primary-dark - Darker navy on hover
// And many more...