import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';

type Getter = () => Promise<string | null>;

let tokenGetter: Getter | null = null;

export const setTokenGetter = (getter: Getter | null) => {
  tokenGetter = getter;
};

export const resolveToken = async () => {
  if (!tokenGetter) return null;
  try {
    return await tokenGetter();
  } catch (error) {
    return null;
  }
};

export const ApiAuthBridge = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    setTokenGetter(() => getToken);
    return () => setTokenGetter(null);
  }, [getToken]);

  return null;
};
