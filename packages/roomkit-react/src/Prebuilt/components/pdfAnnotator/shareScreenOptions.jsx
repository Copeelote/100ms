import React, { Fragment, useState } from 'react';
import { useScreenShare } from '@100mslive/react-sdk';
import { StarIcon, VerticalMenuIcon } from '@100mslive/react-icons';
import { Box, Dropdown, Flex, IconButton, Text, Tooltip } from '../../../';
import { ShareMenuIcon } from '../ShareMenuIcon';
import { PDFFileOptions } from './pdfFileOptions';

const PDFShareImg = new URL('./../../images/pdf-share.png', import.meta.url).href;
const ScreenShareImg = new URL('./../../images/screen-share.png', import.meta.url).href;

const MODALS = {
  SHARE: 'share',
  SCREEN_SHARE: 'screenShare',
  PDF_SHARE: 'pdfShare',
};

export function ShareScreenOptions() {
  const [openModals, setOpenModals] = useState(new Set());
  const { amIScreenSharing } = useScreenShare();
  const updateState = (modalName, value) => {
    setOpenModals(modals => {
      const copy = new Set(modals);
      if (value) {
        copy.add(modalName);
      } else {
        copy.delete(modalName);
      }
      return copy;
    });
  };
  const { toggleScreenShare } = useScreenShare();
  return (
    <Fragment>
      <Dropdown.Root
        open={openModals.has(MODALS.SHARE)}
        onOpenChange={value => updateState(MODALS.SHARE, value)}
        modal={false}
      >
        <Dropdown.Trigger asChild data-testid="sharing_btn" disabled={amIScreenSharing}>
          <ShareMenuIcon disabled={amIScreenSharing}>
            <Tooltip title="Partager">
              <Box>
                <VerticalMenuIcon />
              </Box>
            </Tooltip>
          </ShareMenuIcon>
        </Dropdown.Trigger>
        <Dropdown.Content
          sideOffset={5}
          css={{
            w: '$96',
            maxHeight: '$96',
            p: 0,
            bg: '$surface_dim',
          }}
        >
          <Dropdown.Item
            css={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              px: '$10',
              pt: '$10',
              pb: '$6',
              '&:hover': {
                bg: 'transparent',
                cursor: 'default',
              },
            }}
          >
            <Text variant="h6">Commencer le partage</Text>
            <Text variant="sm">Choisissez ce que vous souhaitez partager</Text>
          </Dropdown.Item>
          <Dropdown.Item
            css={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: '$8',
              px: '$10',
              pt: '$6',
              pb: '$10',
              '&:hover': {
                bg: 'transparent',
                cursor: 'default',
              },
            }}
          >
            <Flex
              direction="column"
              align="center"
              css={{
                gap: '$6',
              }}
            >
              <IconButton
                as="div"
                onClick={toggleScreenShare}
                css={{
                  p: '$6',
                  display: 'flex',
                  justifyContent: 'center',
                  border: '1px solid $border_bright',
                  r: '$2',
                  bg: '$surface_brighter',
                  pb: '0',
                }}
              >
                <img
                  src={ScreenShareImg}
                  alt="screen-share"
                  width="100%"
                  height="100%"
                  style={{
                    borderTopLeftRadius: '0.5rem', // TODO: create image component to solve for style hardcoding
                    borderTopRightRadius: '0.5rem',
                  }}
                />
              </IconButton>
              <Flex direction="column" align="center">
                <Text variant="body2">Partager l’écran</Text>
                <Text
                  variant="caption"
                  css={{
                    c: '$on_surface_low',
                    textAlign: 'center',
                  }}
                >
                  Partagez votre onglet, fenêtre ou l’intégralité de votre écran
                </Text>
              </Flex>
            </Flex>
            <Flex
              direction="column"
              align="center"
              css={{
                gap: '$6',
              }}
            >
              <IconButton
                onClick={() => {
                  updateState(MODALS.PDF_SHARE, true);
                }}
                disabled={amIScreenSharing}
                css={{
                  p: '$6',
                  display: 'flex',
                  justifyContent: 'center',
                  border: '$border_bright 1px solid',
                  r: '$2',
                  bg: '$surface_bright',
                  pb: '0',
                }}
              >
                <img
                  src={PDFShareImg}
                  alt="pdf-share"
                  width="100%"
                  height="100%"
                  style={{
                    borderTopLeftRadius: '0.5rem', // TODO: create image component to solve for style hardcoding
                    borderTopRightRadius: '0.5rem',
                  }}
                />
                <Flex
                  direction="row"
                  align="center"
                  css={{
                    position: 'absolute',
                    top: '35%',
                    left: '54%',
                    padding: '$2 $4',
                    r: '$2',
                    bg: '$primary_bright',
                    zIndex: '2',
                    gap: '$2',
                  }}
                >
                  <StarIcon height={14} width={14} />

                  <Text
                    variant="xs"
                    css={{
                      fontWeight: '$semiBold',
                      c: '$on_primary_high',
                      pr: '$4',
                    }}
                  >
                    Nouveau
                  </Text>
                </Flex>
              </IconButton>
              <Flex direction="column" align="center">
                <Text variant="body2">Partager un PDF</Text>
                <Text
                  variant="caption"
                  css={{
                    c: '$on_surface_low',
                    textAlign: 'center',
                  }}
                >
                  Annoter, dessiner des formes et plus encore sur des PDF
                </Text>
              </Flex>
            </Flex>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
      {openModals.has(MODALS.PDF_SHARE) && (
        <PDFFileOptions onOpenChange={value => updateState(MODALS.PDF_SHARE, value)} />
      )}
    </Fragment>
  );
}
