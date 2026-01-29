import { Role } from './role.entity';
import { Dept } from './dept.entity';
import { KPIScore } from './kpi-score.entity';
import { CalculatedScore } from './calculated-score.entity';
export declare class Employee {
    id: number;
    emp_id: string;
    first_name: string;
    last_name: string;
    email: string;
    contact_no: number;
    type: string;
    role: Role;
    dept: Dept;
    kpiApprover: Employee;
    approvees: Employee[];
    kpiScores: KPIScore[];
    calculatedScores: CalculatedScore[];
    created_at: Date;
    updated_at: Date;
}
