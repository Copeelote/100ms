import React from 'react';
import { Dialog, Text } from '../../../';
import { DialogCol } from '../../primitives/DialogContent';

export const PDFHeader = () => {
  return (
    <DialogCol
      align="start"
      css={{
        mt: 0,
        mb: '$6',
      }}
    >
      <Dialog.Title asChild>
        <Text as="h6" variant="h6">
          Partager un PDF
        </Text>
      </Dialog.Title>
      <Dialog.Description asChild>
        <Text
          variant="sm"
          css={{
            c: '$on_surface_medium',
          }}
        >
          Choisissez le PDF que vous souhaitez annoter et partager
        </Text>
      </Dialog.Description>
    </DialogCol>
  );
};
