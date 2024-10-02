import { z } from "zod"

/* Auth & Users  */
const authSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    'current-password': z.string(),
    'password-confirmation': z.string(),
    token: z.string()
});

export type Auth = z.infer<typeof authSchema>;
export type UserLoginForm = Pick<Auth, 'email' | 'password'>;
export type UserRegistrationForm = Pick<Auth, 'name' | 'email' | 'password' | 'password-confirmation'>;
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>;
export type ForgotPasswordForm = Pick<Auth, 'email'>;
export type NewPasswordForm = Pick<Auth, 'password' | 'password-confirmation'>;
export type UpdatePasswordForm = Pick<Auth, 'current-password' | 'password' | 'password-confirmation'>;
export type ConfirmToken = Pick<Auth, 'token'>;
export type CheckPasswordForm = Pick<Auth, 'password'>;


/* Users */
export const userSchema = authSchema.pick({
    name: true,
    email: true
}).extend({
    _id: z.string()
});
export type User = z.infer<typeof userSchema>;
export type UserProfileForm = Pick<User, 'name' | 'email'>;


/* Notes */
const noteSchema = z.object({
    _id: z.string(),
    content: z.string(),
    createdAt: z.string(),
    createdBy: userSchema.pick({ _id: true, name: true, email: true }),
    task: z.string()
});
export type Note = z.infer<typeof noteSchema>;
export type NoteFormData = Pick<Note, 'content'>;

/* Task */
export const taskStatusSchema = z.enum(["pending", "onHold", "inProgress", "underReview", "completed"]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export const taskSchema = z.object({
    _id: z.string(),
    name: z.string(),
    project: z.string(),
    description: z.string(),
    status: taskStatusSchema,
    completedBy: z.array(
        z.object({
            _id: z.string(),
            user: userSchema,
            status: taskStatusSchema
        })
    ),
    notes: z.array(noteSchema.extend({ createdBy: userSchema })),
    createdAt: z.string(),
    updatedAt: z.string()
});
export const taskProjectSchema = taskSchema.pick({
    _id: true,
    name: true,
    description: true,
    status: true
});
export type Task = z.infer<typeof taskSchema>;
export type TaskFormData = Pick<Task, 'name' | 'description'>;
export type TaskProject = z.infer<typeof taskProjectSchema>;

export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.string(userSchema.pick({ _id: true })),
    tasks: z.array(taskProjectSchema),
    team: z.array(z.string(userSchema.pick({ _id: true })))
});
export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
        manager: true
    })
);
export const editProjectSchema = projectSchema.pick({
    clientName: true,
    projectName: true,
    description: true
});
export type Project = z.infer<typeof projectSchema>;
// Pick: selecciona las propiedades que quiero que se usen desde el type Project.
export type ProjectFormData = Pick<Project, 'clientName' | 'projectName' | 'description'>;


/* Team */
const teamMemberSchema = userSchema.pick({
    name: true,
    email: true,
    _id: true
});
export const teamMembersSchema = z.array(teamMemberSchema);
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamMemberForm = Pick<TeamMember, 'email'>;
