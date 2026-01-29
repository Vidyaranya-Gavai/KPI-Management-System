import { Role } from './role.entity';
import { KPIScore } from './kpi-score.entity';
export declare class KPI {
    id: number;
    name: string;
    description: string;
    type: string;
    score_type: string;
    parent: KPI;
    children: KPI[];
    role: Role;
    contribute_to_parent: boolean;
    kpiScores: KPIScore[];
    created_at: Date;
    updated_at: Date;
}
