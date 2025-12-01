import * as React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

/**
 * @param {object} props 
 * @param {string} props.title 
 * @returns {JSX.Element} 
 */
export default function CustomAppbar({ title }) {
    const theme = useTheme(); 
    const navigation = useNavigation();

    return (
        <Appbar.Header 
            style={{ 
                backgroundColor: theme.colors.primary, 
                elevation: 0, 

                alignItems: 'center', 
                justifyContent: 'flex-start', 
            }}
        >
            <Appbar.BackAction 
                onPress={() => navigation.goBack()} 
                color={theme.colors.onPrimary} 
            />
            

            <Appbar.Content 
                title={title.toUpperCase()} 
                titleStyle={{ 
                    color: theme.colors.onPrimary, 
                    fontSize: 14, 
                    fontWeight: 'bold',

                    textAlign: 'center', 
                }}

                style={{ 
                    position: 'absolute', 
                    left: 0, 
                    right: 0, 
                    zIndex: -1, 
                }}
            />
        </Appbar.Header>
    );
}