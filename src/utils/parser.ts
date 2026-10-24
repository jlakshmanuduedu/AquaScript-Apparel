import { ParsedSections } from '../types';

export function parseAdvisoryReport(text: string): ParsedSections {
  if (!text) {
    return {
      marketRatesRaw: '',
      weatherRiskRaw: '',
      plantHealthRaw: '',
      actionableStepsRaw: '',
      actionStepsList: [],
    };
  }

  // Regex patterns to identify the 4 required sections
  // Can be prefixed with markdown headers (#, ##, ###, -, *, etc.) and emojis
  const marketRatesRegex = /(?:###?|##|\*\*|[-*])?\s*(?:📊|Live Market Rates|Market Rates)[^\n]*\n([\s\S]*?)(?=(?:###?|##|\*\*|[-*])?\s*(?:☁️|Weather & Climate Risk Alert|Weather Alert)|$)/i;
  const weatherRiskRegex = /(?:###?|##|\*\*|[-*])?\s*(?:☁️|Weather & Climate Risk Alert|Weather Alert)[^\n]*\n([\s\S]*?)(?=(?:###?|##|\*\*|[-*])?\s*(?:🛡️|Plant Health & Remedy Advisory|Plant Health)|$)/i;
  const plantHealthRegex = /(?:###?|##|\*\*|[-*])?\s*(?:🛡️|Plant Health & Remedy Advisory|Plant Health)[^\n]*\n([\s\S]*?)(?=(?:###?|##|\*\*|[-*])?\s*(?:💡|Actionable Next Steps|Next Steps)|$)/i;
  const actionableStepsRegex = /(?:###?|##|\*\*|[-*])?\s*(?:💡|Actionable Next Steps|Next Steps)[^\n]*\n([\s\S]*)$/i;

  const marketRatesMatch = text.match(marketRatesRegex);
  const weatherRiskMatch = text.match(weatherRiskRegex);
  const plantHealthMatch = text.match(plantHealthRegex);
  const actionableStepsMatch = text.match(actionableStepsRegex);

  const marketRatesRaw = marketRatesMatch ? marketRatesMatch[1].trim() : '';
  const weatherRiskRaw = weatherRiskMatch ? weatherRiskMatch[1].trim() : '';
  const plantHealthRaw = plantHealthMatch ? plantHealthMatch[1].trim() : '';
  const actionableStepsRaw = actionableStepsMatch ? actionableStepsMatch[1].trim() : '';

  // Parse actionable steps into discrete items
  const actionStepsList: string[] = [];
  if (actionableStepsRaw) {
    const lines = actionableStepsRaw.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      // Match bullet points (-, *, •, 1., 2.)
      const bulletMatch = trimmed.match(/^(?:[-*•]|\d+\.)\s+(.+)$/);
      if (bulletMatch && bulletMatch[1].trim().length > 5) {
        actionStepsList.push(bulletMatch[1].trim());
      } else if (trimmed.length > 15 && !trimmed.startsWith('#') && !trimmed.startsWith('**Today') && !trimmed.startsWith('---')) {
        // Also capture plain sentences if they look like action items
        actionStepsList.push(trimmed);
      }
    }
  }

  return {
    marketRatesRaw: marketRatesRaw || (text.length > 0 ? text : 'No market rates extracted.'),
    weatherRiskRaw,
    plantHealthRaw,
    actionableStepsRaw,
    actionStepsList: actionStepsList.length > 0 ? actionStepsList : [
      'Review moisture level of harvested crop before transport',
      'Check morning field conditions and dew clearance before spraying',
      'Monitor local market arrivals for price stability before dispatch'
    ],
  };
}

export function cleanMarkdown(str: string): string {
  if (!str) return '';
  return str
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}
