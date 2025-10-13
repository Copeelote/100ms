import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';
import { Button } from '../Button';
import { Flex } from '../Layout';
import { Text } from '../Text';
import { Toast } from './Toast';
import ToastDocs from './Toast.mdx';

const ToastStory = ({ ...props }) => {
  return (
    <Toast.Provider>
      <ToastComponent {...props} />
    </Toast.Provider>
  );
};

const ToastMeta = {
  title: 'Composants UI/Toast',
  component: ToastStory,
  argTypes: {
    onClick: { action: 'clicked' },
    icon: { control: 'boolean' },
  },
  parameters: {
    docs: {
      page: ToastDocs,
    },
  },
};

const ToastComponent = ({ ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Fermer' : 'Lancer'} Toast</Button>
      <Toast.Root open={isOpen} onOpenChange={o => setIsOpen(o)} {...props}>
        <Toast.Title asChild>
          <Flex align="center" css={{ gap: '$4', flex: '1 1 0', minWidth: 0 }}>
            <Text variant="sub1" css={{ c: 'inherit', wordBreak: 'break-word' }}>
              Bonjour depuis le toast.
            </Text>
            <Toast.Close />
          </Flex>
        </Toast.Title>
        <Toast.Description>
          Ceci est un composant toast personnalisé utilisant des primitives avec un état d’ouverture et de fermeture
          contrôlé via l’état React.
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport css={{ bottom: '$24' }} />
    </>
  );
};
export const Example: ComponentStory<typeof ToastStory> = ToastStory.bind({});

Example.storyName = 'Toast';

export default ToastMeta;
