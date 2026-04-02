import { useState } from 'react';
import FaIcon from '@/app/components/FaIcon';
import Button from '@/app/components/shared/Button';
import type { EnvVar } from '@/app/types/containers';

interface EnvVarInputProps {
  variables: EnvVar[];
  onChange: (vars: EnvVar[]) => void;
  templateVars?: { key: string; value: string; description: string }[];
}

export default function EnvVarInput({
  variables,
  onChange,
  templateVars = [],
}: EnvVarInputProps) {
  const [showTemplateVars, setShowTemplateVars] = useState(false);

  const handleAdd = () => {
    if (variables.length >= 100) {
      return; // Max 100 variables
    }
    onChange([...variables, { key: '', value: '', isSecret: false }]);
  };

  const handleRemove = (index: number) => {
    onChange(variables.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof EnvVar, value: string | boolean) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleLoadTemplate = () => {
    const newVars = templateVars.map(tv => ({
      key: tv.key,
      value: tv.value,
      isSecret: false,
    }));
    onChange([...variables, ...newVars]);
    setShowTemplateVars(false);
  };

  return (
    <div className="space-y-[12px]">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-[13px] font-medium text-[#243342] mb-[4px]">
            Environment Variables
          </label>
          <p className="text-[12px] text-[#687a8b]">
            Add environment variables for your container (max 100)
          </p>
        </div>
        {templateVars.length > 0 && variables.length === 0 && (
          <Button
            variant="outline"
            onClick={handleLoadTemplate}
            className="text-[12px]"
          >
            <FaIcon icon="fas fa-wand-magic-sparkles" className="mr-[6px]" />
            Load Template Vars
          </Button>
        )}
      </div>

      {/* Variable rows */}
      <div className="space-y-[8px]">
        {variables.map((variable, index) => (
          <div key={index} className="flex items-start gap-[8px]">
            {/* Key input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="KEY"
                value={variable.key}
                onChange={(e) => handleChange(index, 'key', e.target.value)}
                className="w-full h-[40px] px-[12px] bg-white border border-[#e6e9ec] rounded-[8px] text-[14px] text-[#243342] placeholder:text-[#9ba7b2] focus:outline-none focus:border-[#1870c6] font-mono"
              />
            </div>

            {/* Value input */}
            <div className="flex-1">
              <input
                type={variable.isSecret ? 'password' : 'text'}
                placeholder="value"
                value={variable.value}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
                className="w-full h-[40px] px-[12px] bg-white border border-[#e6e9ec] rounded-[8px] text-[14px] text-[#243342] placeholder:text-[#9ba7b2] focus:outline-none focus:border-[#1870c6] font-mono"
              />
            </div>

            {/* Secret toggle */}
            <button
              onClick={() => handleChange(index, 'isSecret', !variable.isSecret)}
              className={`w-[40px] h-[40px] flex items-center justify-center rounded-[8px] transition-colors ${
                variable.isSecret
                  ? 'bg-[#1870c6] text-white'
                  : 'bg-white border border-[#e6e9ec] text-[#687a8b] hover:text-[#243342]'
              }`}
              title={variable.isSecret ? 'Secret (hidden)' : 'Not secret (visible)'}
            >
              <FaIcon icon={variable.isSecret ? 'fas fa-eye-slash' : 'fas fa-eye'} />
            </button>

            {/* Remove button */}
            <button
              onClick={() => handleRemove(index)}
              className="w-[40px] h-[40px] flex items-center justify-center rounded-[8px] bg-white border border-[#e6e9ec] text-[#687a8b] hover:text-[#dc2626] hover:border-[#dc2626] transition-colors"
            >
              <FaIcon icon="fas fa-trash-can" />
            </button>
          </div>
        ))}
      </div>

      {/* Add button */}
      {variables.length < 100 && (
        <Button
          variant="outline"
          onClick={handleAdd}
          className="w-full"
        >
          <FaIcon icon="fas fa-plus" className="mr-[8px]" />
          Add Variable
        </Button>
      )}

      {variables.length === 0 && (
        <div className="bg-[#f8fafc] rounded-[8px] p-[20px] text-center">
          <FaIcon icon="fas fa-code" className="text-[#9ba7b2] text-[24px] mb-[8px]" />
          <p className="text-[12px] text-[#687a8b]">
            No environment variables added yet
          </p>
        </div>
      )}

      {variables.length >= 100 && (
        <p className="text-[12px] text-[#f59e0b]">
          Maximum of 100 environment variables reached
        </p>
      )}

      {/* Helper text for template vars */}
      {showTemplateVars && templateVars.length > 0 && (
        <div className="bg-[#eef4fe] rounded-[8px] p-[16px] space-y-[8px]">
          <div className="flex items-center justify-between mb-[8px]">
            <p className="text-[12px] font-medium text-[#243342]">
              Template Variables Available:
            </p>
            <button
              onClick={() => setShowTemplateVars(false)}
              className="text-[#687a8b] hover:text-[#243342]"
            >
              <FaIcon icon="fas fa-times" />
            </button>
          </div>
          {templateVars.map((tv, index) => (
            <div key={index} className="flex items-center gap-[8px] text-[12px]">
              <code className="text-[#1870c6] font-mono">{tv.key}</code>
              <span className="text-[#687a8b]">=</span>
              <code className="text-[#243342] font-mono">{tv.value}</code>
              <span className="text-[#9ba7b2]">({tv.description})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
