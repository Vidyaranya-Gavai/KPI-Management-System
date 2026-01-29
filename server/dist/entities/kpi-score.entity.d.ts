import { KPI } from './kpi.entity';
import { Employee } from './employee.entity';
import { MonthEnum } from './month.enum';
export declare class KPIScore {
    id: number;
    kpi: KPI;
    employee: Employee;
    score: number;
    month: MonthEnum;
    year: number;
    created_at: Date;
    updated_at: Date;
}
