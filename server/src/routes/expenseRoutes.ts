import { Router } from 'express';

const expenseRoutes =  Router();


function expense(){
	console.log('Expense');
}


expenseRoutes.get('/', expense);
expenseRoutes.post('/', expense);
expenseRoutes.get('/:id', expense);
expenseRoutes.put('/:id', expense);
expenseRoutes.delete('/:id', expense);

export default expenseRoutes;