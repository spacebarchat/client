import {observer} from 'mobx-react';
import React from 'react';
import {ScrollView, SectionList} from 'react-native';
import {Surface, Text, useTheme} from 'react-native-paper';
import {CustomTheme} from '../../constants/Colors';
import {DomainContext} from '../../stores/DomainStore';
import Guild from '../../stores/objects/Guild';
import Container from '../Container';
import UserActions from '../UserActions';
import ChannelItem from './ChannelItem';

interface Props {
  guild: Guild | undefined;
}

// TODO: lighter background color for current channel item
// TODO: ability to click a channel item to switch to that channel
// TODO: hover color for channel items
function ChannelSidebar({guild}: Props) {
  const theme = useTheme<CustomTheme>();
  const domain = React.useContext(DomainContext);

  return (
    <Container
      testID="channelSidebar"
      style={{
        backgroundColor: theme.colors.palette.neutral30,
        height: '100%',
        width: 240,
      }}>
      <Container testID="channelsWrapper" displayFlex flexOne>
        <Container
          testID="channelHeader"
          verticalCenter
          horizontalCenter
          style={{
            height: 48,
            backgroundColor: theme.colors.palette.neutral30,
          }}
          element={Surface}
          elevation={2}>
          <Text>{guild?.name}</Text>
        </Container>
        <Container displayFlex flexOne>
          <ScrollView style={{padding: 10}}>
            <SectionList
              sections={guild?.channelList ?? []}
              keyExtractor={(item, index) => item.id + index}
              renderItem={({item}) => <ChannelItem channel={item} />}
              renderSectionHeader={({section: {title}}) => {
                if (!title) {
                  return null;
                }
                return (
                  <Container
                    style={{
                      backgroundColor: theme.colors.palette.neutral30,
                    }}>
                    <Text>{title.toUpperCase()}</Text>
                  </Container>
                );
              }}
              stickySectionHeadersEnabled={true}
              contentContainerStyle={{padding: 10}}
            />
          </ScrollView>
        </Container>
      </Container>
      <Container
        testID="channelFooter"
        style={{
          backgroundColor: theme.colors.palette.neutral25,
        }}>
        <UserActions />
      </Container>
    </Container>
  );
}

export default observer(ChannelSidebar);
