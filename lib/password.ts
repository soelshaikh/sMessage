import db from './db';

const SECRET_DATE = '21-01-2023';
const MAX_ATTEMPTS = 5;

export function verifyPassword(token: string, password: string): { success: boolean; attemptsLeft?: number; message?: string } {
  // Get current attempts
  const stmt = db.prepare('SELECT password_attempts, password_verified FROM surprise_events WHERE qr_token = ?');
  const result = stmt.get(token) as { password_attempts: number; password_verified: number } | undefined;
  
  if (!result) {
    return { success: false, message: 'Invalid token' };
  }
  
  // Check if already verified
  if (result.password_verified === 1) {
    return { success: true };
  }
  
  // Check if max attempts exceeded
  if (result.password_attempts >= MAX_ATTEMPTS) {
    return { success: false, message: 'Maximum attempts exceeded', attemptsLeft: 0 };
  }
  
  // Verify password
  if (password === SECRET_DATE) {
    // Update database - mark as verified
    const updateStmt = db.prepare(`
      UPDATE surprise_events 
      SET password_verified = 1, password_attempts = password_attempts + 1 
      WHERE qr_token = ?
    `);
    updateStmt.run(token);
    
    return { success: true };
  } else {
    // Increment attempts
    const updateStmt = db.prepare(`
      UPDATE surprise_events 
      SET password_attempts = password_attempts + 1 
      WHERE qr_token = ?
    `);
    updateStmt.run(token);
    
    const attemptsLeft = MAX_ATTEMPTS - (result.password_attempts + 1);
    
    // Funny messages based on attempts left
    const funnyMessages = [
      "Oops! That's not it. Think harder... when did the magic begin? 🤔",
      "Nice try! But that's not our special date. Remember the beginning? 💭",
      "Hmm, not quite! Need a hint? Think about our first hello! 👋",
      "Close, but no cigar! 🚬 Our journey started on a different day!",
      "Wrong date, friend! Maybe check your memory bank again? 🏦"
    ];
    
    const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    
    return { 
      success: false, 
      attemptsLeft,
      message: attemptsLeft > 0 ? `${randomMessage} (${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} left)` : '🚫 Uh oh! Maximum attempts exceeded. Maybe ask for help? 😅'
    };
  }
}

export function isPasswordVerified(token: string): boolean {
  const stmt = db.prepare('SELECT password_verified FROM surprise_events WHERE qr_token = ?');
  const result = stmt.get(token) as { password_verified: number } | undefined;
  return result?.password_verified === 1;
}
