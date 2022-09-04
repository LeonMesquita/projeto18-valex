import * as companyRepository from '../src/repositories/companyRepository';
import * as employeeRepository from '../src/repositories/employeeRepository';

import { checkDataExists, throwError } from './throwError';


export async function checkCompanyByApiKey(apiKey: string){
    const company = await companyRepository.findByApiKey(apiKey);
    checkDataExists(company, 'Company');
    return company;
}



export async function checkIsCompanyEmployee(employeeId: number, companyId: number){
    const employee = await employeeRepository.findById(employeeId);
    checkDataExists(employee, 'Employee');
    if(employee.companyId != companyId) throwError(401, 'This employee do not belongs to this company');
}