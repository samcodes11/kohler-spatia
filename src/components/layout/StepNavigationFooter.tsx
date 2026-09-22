import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useConfigurator } from '../../context/ConfiguratorContext';

interface StepNavigationFooterProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

export const StepNavigationFooter: React.FC<StepNavigationFooterProps> = ({
  onNavigateHome,
  onNavigateDashboard
}) => {
  const { activeStep, setActiveStep } = useConfigurator();

  const handlePrevious = () => {
    if (activeStep === 1) {
      onNavigateHome();
    } else if (activeStep === 2) {
      setActiveStep(1);
    } else if (activeStep === 3) {
      setActiveStep(2);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (activeStep === 1) {
      setActiveStep(2);
    } else if (activeStep === 2) {
      setActiveStep(3);
    } else if (activeStep === 3) {
      onNavigateDashboard();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStepTitle = () => {
    switch (activeStep) {
      case 1:
        return 'Step 1 of 3: Space, Budget & Theme Foundation';
      case 2:
        return 'Step 2 of 3: Product Specification & Surface Finishes';
      case 3:
        return 'Step 3 of 3: Interactive 3D Dollhouse & Contractor Report';
      default:
        return '';
    }
  };

  const getPreviousLabel = () => {
    switch (activeStep) {
      case 1:
        return 'Back to Home';
      case 2:
        return 'Step 1: Space & Theme';
      case 3:
        return 'Step 2: Fixtures';
      default:
        return 'Previous';
    }
  };

  const getNextLabel = () => {
    switch (activeStep) {
      case 1:
        return 'Step 2: Select Fixtures';
      case 2:
        return 'Step 3: 3D Visualization';
      case 3:
        return 'Go to Project Dashboard';
      default:
        return 'Next';
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone/20 shadow-luxury py-3 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Previous Button */}
        <button
          type="button"
          onClick={handlePrevious}
          className="px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-mono uppercase tracking-wider text-ink hover:text-accent border border-stone/30 hover:border-accent bg-white rounded-xs transition-all duration-200 flex items-center gap-2 font-bold cursor-pointer shrink-0"
        >
          <ArrowLeft size={16} />
          <span className="hidden xs:inline">{getPreviousLabel()}</span>
        </button>

        {/* Center: Current Step Status Indicator */}
        <div className="flex items-center gap-3 text-center">
          <div className="hidden md:flex items-center gap-2">
            {[1, 2, 3].map((step) => {
              const isActive = activeStep === step;
              const isCompleted = activeStep > step;
              return (
                <React.Fragment key={step}>
                  <div
                    onClick={() => {
                      setActiveStep(step as 1 | 2 | 3);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'bg-accent text-white ring-2 ring-accent/30 shadow-xs'
                        : isCompleted
                        ? 'bg-ink text-white'
                        : 'bg-stone/15 text-stone-dark hover:bg-stone/30'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={14} /> : step}
                  </div>
                  {step < 3 && <div className="w-4 h-[2px] bg-stone/20" />}
                </React.Fragment>
              );
            })}
          </div>
          <span className="text-xs sm:text-sm font-mono font-bold text-ink truncate max-w-[200px] sm:max-w-none">
            {getStepTitle()}
          </span>
        </div>

        {/* Right: Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-mono uppercase tracking-wider text-porcelain bg-ink hover:bg-accent rounded-xs transition-all duration-200 flex items-center gap-2 font-bold cursor-pointer shadow-luxury shrink-0 group"
        >
          <span>{getNextLabel()}</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>

      </div>
    </nav>
  );
};
