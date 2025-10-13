import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';
import { Button } from '../Button';
import { Toast } from './Toast';
import mdx from './Toast.mdx';

const ReactToastStory = ({ ...props }) => {
  return (
    <Toast.Provider>
      <ReactToastComponent {...props} />
    </Toast.Provider>
  );
};

const ToastMeta = {
  title: 'Composants UI/Toast',
  component: ReactToastStory,
  argTypes: {
    onClick: { action: 'clicked' },
    open: { control: 'boolean' },
    variant: { control: 'select', options: ['error', 'standard', 'warning', 'success', ''] },
  },
  args: {
    variant: 'standard',
    title: 'Bonjour depuis le composant Toast',
    description: 'Bonjour depuis le toast',
    isClosable: true,
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
};

const ReactToastComponent: ComponentStory<typeof ReactToastStory> = args => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Fermer' : 'Lancer'} Toast</Button>
      <Toast.HMSToast
        title="Ceci est un titre"
        description="Ceci est un toast utilisant le composant HMSToast."
        open={isOpen}
        isClosable={true}
        onOpenChange={o => setIsOpen(o)}
        {...args}
      />
      <Toast.Viewport css={{ bottom: '$24' }} />
    </>
  );
};

export const Playground: ComponentStory<typeof ReactToastStory> = ReactToastStory.bind({});
Playground.storyName = 'HMSToast';
export default ToastMeta;
