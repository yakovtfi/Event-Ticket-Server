import bcrypt from 'bcrypt';
import { readJsonFile, writeJsonFile } from '../utils/fileHelper.js';

export const registerUser = async (req, res) => {
  try {
    const { username, password,role ='user' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
// bonus 1
    if(!['user','admin'].includes(role)){
       return res.status(400).json({ error: 'Role must be either "user" or "admin"' });
    }

    

    const users = await readJsonFile('users.json');

    const userExists = users.find(u => u.username === username);
    if (userExists) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString()
    
    };

    users.push(newUser);
    await writeJsonFile('users.json', users);

    return res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const validateUser = async (username, password) => {
  try {
    const users = await readJsonFile('users.json');
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  } catch (err) {
    console.error('Validation error:', err);
    return null;
  }
};
