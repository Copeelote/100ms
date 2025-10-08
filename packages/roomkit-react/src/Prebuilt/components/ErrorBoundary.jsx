import React, { Component } from 'react';
import { CopyIcon } from '@100mslive/react-icons';
import { Button } from '../../Button';
import { Box, Flex } from '../../Layout';
import { Text } from '../../Text';
import { Tooltip } from '../../Tooltip';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null, isErrorCopied: false };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`react error boundary - ${error.message}`, error, errorInfo);
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error?.message,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <Flex
          align="center"
          justify="center"
          css={{
            size: '100%',
            height: '100vh',
            width: '100%',
            color: '$on_primary_high',
            backgroundColor: '$background_default',
          }}
        >
          <Box css={{ position: 'relative', overflow: 'hidden', r: '$3', height: '100%', width: '100%' }}>
            <Flex
              direction="column"
              css={{
                position: 'absolute',
                size: '100%',
                top: '33.33%',
                left: 0,
              }}
            >
              <div style={{ margin: '1.5rem', width: '100%' }}>
                <Text>Quelque chose s'est mal passé</Text>
                <Text>Message : ${this.state.error}</Text>
                <br />
                Veuillez recharger pour voir si cela fonctionne. Si vous pensez que c'est une erreur de notre côté, contactez-nous
                sur&nbsp;
                <a href="https://dashboard.100ms.live/dashboard" target="_blank" rel="noreferrer">
                  Dashboard
                </a>
              </div>
              <Flex>
                <Tooltip title="Recharger la page">
                  <Button
                    onClick={() => {
                      window.location.reload();
                    }}
                    css={{ mx: '$8' }}
                    data-testid="join_again_btn"
                  >
                    Recharger
                  </Button>
                </Tooltip>
                <Tooltip title="Copier les détails de l'erreur dans le presse-papiers">
                  <Button
                    onClick={() => {
                      const { error, errorInfo } = this.state;
                      navigator.clipboard.writeText(
                        JSON.stringify({
                          error,
                          errorInfo,
                        }),
                      );
                      this.setState({ isErrorCopied: true });
                    }}
                    css={{ mx: '$8' }}
                    data-testid="join_again_btn"
                  >
                    <CopyIcon /> {this.state.isErrorCopied ? 'Copié' : 'Copier les détails'}
                  </Button>
                </Tooltip>
              </Flex>

              <details style={{ whiteSpace: 'pre-wrap', margin: '1.5rem' }}>
                <Text>{this.state.error && this.state.error.toString()}</Text>
                <br />
                <Text>{JSON.stringify(this.state.errorInfo)}</Text>
              </details>
            </Flex>
          </Box>
        </Flex>
      );
    }

    return this.props.children;
  }
}
