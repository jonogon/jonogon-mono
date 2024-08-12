import {router} from '../index.mjs';
import {requestOTPProcedure} from '../procedures/auth/request-otp.mjs';
import {createTokenProcedure} from '../procedures/auth/create-token.mjs';
import {refreshTokenProcedure} from '../procedures/auth/refresh-token.mjs';
import {invalidateRefreshTokenProcedure} from '../procedures/auth/invalidate-refresh-token.mjs';

export const authRouter = router({
    requestOTP: requestOTPProcedure,
    createToken: createTokenProcedure,
    refreshToken: refreshTokenProcedure,
    invalidateRefreshToken: invalidateRefreshTokenProcedure,
});
