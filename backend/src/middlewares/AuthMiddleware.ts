import { Action } from 'routing-controllers';
import { UserService } from '../services/UserService';
import { Container } from 'typedi';
import * as jwt from 'jsonwebtoken';

export function authorizationChecker(action: Action, roles: string[]): Promise<boolean> | boolean {
  const authorization = action.request.headers['authorization'];
  
  if (!authorization) {
    return false;
  }
  
  const [, token] = authorization.split(' ');
  
  if (!token) {
    return false;
  }
  
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as { id: number };
    return true;
  } catch (e) {
    return false;
  }
}

export async function currentUserChecker(action: Action) {
  const authorization = action.request.headers['authorization'];
  
  if (!authorization) {
    return undefined;
  }
  
  const [, token] = authorization.split(' ');
  
  if (!token) {
    return undefined;
  }
  
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as { id: number };
    const userService = Container.get(UserService);
    const user = await userService.findById(decodedToken.id);
    return user;
  } catch (e) {
    return undefined;
  }
} 