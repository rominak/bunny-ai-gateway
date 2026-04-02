export type DeploymentType = 'magic' | 'single' | 'advanced';
export type AppStatus = 'running' | 'stopped' | 'deploying' | 'error';
export type RegistryType = 'dockerhub' | 'github' | 'gitlab' | 'custom';

export interface ContainerApp {
  id: string;
  name: string;
  image: string;
  imageTag: string;
  status: AppStatus;
  deploymentType: DeploymentType;
  region?: string;              // Single region deployment
  regions?: string[];           // Advanced multi-region deployment
  cpu: string;                  // e.g., "0.5"
  memory: string;               // e.g., "512"
  port: number;
  url: string;
  createdAt: string;
  health: 'healthy' | 'warning' | 'error';
  instanceCount: number;
}

export interface AppTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;                 // FontAwesome icon name
  recommended?: boolean;
  image: string;                // Docker image name, e.g., "node"
  defaultTag: string;           // e.g., "20-alpine"
  category: 'runtime' | 'database' | 'framework' | 'custom';
  defaultPort: number;
  defaultCpu: string;
  defaultMemory: string;
  envVars?: { key: string; value: string; description: string }[];
  details?: string[];           // Chip text for PresetCardGrid
}

export interface ImageRegistry {
  id: string;
  name: string;
  type: RegistryType;
  url: string;
  username?: string;
  isPublic: boolean;
  imageCount?: number;
  lastSynced?: string;
}

export interface Region {
  code: string;
  name: string;
  flag: string;
  latency: string;
}

export interface CPUOption {
  value: string;
  label: string;
  pricePerHour: number;
}

export interface MemoryOption {
  value: string;
  label: string;
  pricePerHour: number;
}

export interface EnvVar {
  key: string;
  value: string;
  isSecret?: boolean;
}

export interface ImageValidationResult {
  found: boolean;
  size?: string;
  architecture?: string;
  lastUpdated?: string;
}

// --- App Templates Catalog Types ---

export type TemplateCategoryFilter =
  | 'all'
  | 'cms'
  | 'analytics'
  | 'automation'
  | 'monitoring'
  | 'development'
  | 'communication'
  | 'storage';

export type DataPathType = 'cdn' | 'anycast';

export interface TemplateVolume {
  name: string;
  mountPath: string;
  sizeGB: number;
}

export interface TemplateEnvVar {
  key: string;
  value: string;
  description: string;
  isSecret: boolean;
  isReadOnly: boolean;
  required: boolean;
}

export interface TemplateContainer {
  id: string;
  name: string;
  image: string;
  tag: string;
  role: 'primary' | 'worker' | 'proxy';
  port: number;
  volumes?: TemplateVolume[];
  envVars: TemplateEnvVar[];
}

export interface TemplateDatabase {
  id: string;
  name: string;
  image: string;
  tag: string;
  port: number;
  volumes?: TemplateVolume[];
  envVars: TemplateEnvVar[];
}

export interface TemplateConnection {
  fromContainerId: string;
  toDatabaseId: string;
  label?: string;
}

export interface TemplateComposition {
  dataPath: {
    type: DataPathType;
    label: string;
    description: string;
  };
  containers: TemplateContainer[];
  databases: TemplateDatabase[];
  connections: TemplateConnection[];
}

export interface CatalogTemplate {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: string;
  author: string;
  category: TemplateCategoryFilter;
  deployCount: number;
  featured?: boolean;
  tags: string[];
  composition: TemplateComposition;
  sourceRepo: string;
  defaultCpu: string;
  defaultMemory: string;
  estimatedMonthlyCost: number;
}

export interface GitHubAccount {
  id: string;
  username: string;
  avatarUrl: string;
}

export interface DeployConfig {
  templateId: string;
  githubAccount: GitHubAccount | null;
  repoName: string;
  repoVisibility: 'public' | 'private';
  envVars: TemplateEnvVar[];
  region: string;
  cpu: string;
  memory: string;
}

export type DeployStepStatus = 'pending' | 'running' | 'success' | 'error';

export interface DeployStep {
  id: string;
  label: string;
  description: string;
  status: DeployStepStatus;
  duration?: number;
  error?: string;
}

export interface DeploymentState {
  steps: DeployStep[];
  currentStepIndex: number;
  isComplete: boolean;
  liveUrl?: string;
  startedAt: string;
  completedAt?: string;
}
