import { useCallback, useEffect, useRef, useState } from 'react';
import type { GetResponse, Layout } from '@100mslive/types-prebuilt';
import { defaultLayout } from '../constants';

// this should take endpoint and return
export type useFetchRoomLayoutProps = {
  endpoint?: string;
  authToken: string;
};

export type useFetchRoomLayoutResponse = {
  layout: Layout | undefined;
  updateRoomLayoutForRole: (role: string) => void;
  setOriginalLayout: () => void;
};

export const useFetchRoomLayout = ({
  endpoint = '',
  authToken = '',
}: useFetchRoomLayoutProps): useFetchRoomLayoutResponse => {
  const [layout, setLayout] = useState<Layout | undefined>(undefined);
  const layoutResp = useRef<GetResponse>();
  const originalLayout = useRef<Layout>();
  const isFetchInProgress = useRef(false);

  const setOriginalLayout = useCallback(() => setLayout(originalLayout.current), []);

  const updateRoomLayoutForRole = useCallback((role: string) => {
    if (!layoutResp.current) {
      return;
    }
    const [layout] = (layoutResp.current?.data || []).filter(layout => layout.role === role);
    if (layout) {
      // Preserve logo from original layout if role-specific layout doesn't have one
      const layoutWithLogo = {
        ...layout,
        logo: layout.logo || originalLayout.current?.logo,
      };
      setLayout(layoutWithLogo);
    }
  }, []);
  useEffect(() => {
    if (isFetchInProgress.current || !authToken) {
      return;
    }
    isFetchInProgress.current = true;
    layoutResp.current = {
      data: [defaultLayout],
    };
    let layoutForRole = layoutResp.current?.data?.[0];
    if (!layoutForRole) {
      console.error(
        '[Room Layout API]: Unable to figure out room layout from API response. Resorting to default layout.',
      );
      layoutForRole = defaultLayout;
    }
    const layout = layoutForRole;
    if (!originalLayout.current) {
      originalLayout.current = layout;
    }
    setLayout(layout);
    isFetchInProgress.current = false;
  }, [authToken, endpoint]);

  return { layout, updateRoomLayoutForRole, setOriginalLayout };
};
