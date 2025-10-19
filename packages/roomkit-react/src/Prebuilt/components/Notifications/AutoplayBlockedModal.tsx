import React from 'react';
import { useAutoplayError } from '@100mslive/react-sdk';
import { Button, Dialog, Text } from '../../..';
// @ts-ignore: No implicit Any
import { DialogContent, DialogRow } from '../../primitives/DialogContent';

export function AutoplayBlockedModal() {
  const { error, resetError, unblockAudio } = useAutoplayError();
  return (
    <Dialog.Root
      open={!!error}
      onOpenChange={async value => {
        if (!value) {
          await unblockAudio();
        }
        resetError();
      }}
    >
      <DialogContent title="Erreur de permission" closeable={false}>
        <DialogRow>
          <Text variant="md">
            Le navigateur souhaite obtenir une confirmation pour lire l'audio. Veuillez autoriser l'audio pour continuer.
          </Text>
        </DialogRow>
        <DialogRow justify="end">
          <Button
            variant="primary"
            onClick={async () => {
              await unblockAudio();
              resetError();
            }}
          >
            Autoriser l'audio
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
}
