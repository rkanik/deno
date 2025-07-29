export const Key = {
	users: () => ['users'] as const,
	user: (email: string) => ['users', email] as const,
	todos: (userId: number) => ['/users', userId, 'todos'] as const,
	todo: (userId: number, todoId: number) => ['/users', userId, 'todos', todoId] as const,
}
