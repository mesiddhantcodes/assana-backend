import * as bcrypt from "bcrypt";

export const encryptPassword = async (password: string): Promise<string> => {
    const salt =  bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return  bcrypt.compareSync(password, hashedPassword);
}


