import { Employee } from './employee.entity';
import { MonthEnum } from './month.enum';
export declare class CalculatedScore {
    id: number;
    employee: Employee;
    final_score: number;
    month: MonthEnum;
    year: number;
    created_at: Date;
    updated_at: Date;
}
