import { Dept } from './dept.entity';
import { KPI } from './kpi.entity';
import { Employee } from './employee.entity';
export declare class Role {
    id: number;
    name: string;
    type: string;
    dept: Dept;
    kpis: KPI[];
    employees: Employee[];
    created_at: Date;
    updated_at: Date;
}
