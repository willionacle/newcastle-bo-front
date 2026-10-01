import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Input,
  Select,
  Table,
  Row,
  Col,
  notification,
  Space,
  Tag,
  Popconfirm
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import Panel from '@/components/Panel';
import { searchGamesAPI, getUserHiddenGamesAPI } from '@/api/game-settings/get';
import { upsertGameSettingsAPI } from '@/api/game-settings/put';
import type { GameItem, HiddenGameItem } from '@/api/game-settings/get';

interface UserGameSettingsProps {
  userId: number;
  username?: string; // username of the user being edited
}

interface GameSettingItem extends GameItem {
  is_hidden?: 0 | 1 | true | false;
  display_order?: number | null;
  hasSettings?: boolean;
}

const UserGameSettings: React.FC<UserGameSettingsProps> = ({ userId, username }) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState({
    q: '',
    category: '',
    vendor_id: '',
    limit: 20
  });

  //
  const [filteredGames, setFilteredGames] = useState<GameSettingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<GameItem[]>([]);
  const [hiddenGames, setHiddenGames] = useState<HiddenGameItem[]>([]);
  const [gameInfoMap, setGameInfoMap] = useState<Map<number, GameItem>>(new Map());

  // load hidden game list
  const loadHiddenGames = useCallback(async () => {
    try {
      const response = await getUserHiddenGamesAPI(userId);
      if (response.code === 0) {
        setHiddenGames(response.data);
      }
    } catch (error) {
      console.error('Failed to load hidden games:', error);
    }
  }, [userId]);



  useEffect(() => {
    if (userId) {
      loadHiddenGames();
    }
  }, [userId, loadHiddenGames]);

  // process search results (backend already includes is_hidden)
  useEffect(() => {
    if (searchResult.length > 0) {
      // store searched game info in the map
      const newGameInfoMap = new Map(gameInfoMap);
      searchResult.forEach(game => {
        newGameInfoMap.set(game.id, game);
      });
      setGameInfoMap(newGameInfoMap);

      // backend already returns is_hidden, so use it directly
      const gamesWithSettings = searchResult.map((game: GameItem) => ({
        ...game,
        hasSettings: true // backend always returns is_hidden, so treat all games as having settings
      }));
      setFilteredGames(gamesWithSettings);
    }
  }, [searchResult, gameInfoMap]);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      // add username param
      const searchParamsWithUser = {
        ...searchParams,
        username: username
      };

      const response = await searchGamesAPI(searchParamsWithUser);
      if (response.code === 0) {
        setSearchResult(response.data);
      } else {
        notification.error({ message: t('toast.gameSettings.searchFailed') });
      }
    } catch (error) {
      console.error('Game search error:', error);
      notification.error({ message: t('toast.gameSettings.searchError') });
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, username]);

  const handleUpdateGameSetting = useCallback(async (gameId: number, settingType: 'is_hidden' | 'display_order', value: any) => {
    try {
      const updateData: any = { user_id: userId, game_id: gameId };
      updateData[settingType] = value;

      const response = await upsertGameSettingsAPI(updateData);

             if (response.code === 0) {
         notification.success({ message: t('toast.gameSettings.saveSuccess') });

         // refetch search results to sync with latest data
         if (searchResult.length > 0) {
           await handleSearch();
         }

         // refresh hidden game list
         loadHiddenGames();
      } else {
        notification.error({ message: response.message || t('toast.gameSettings.saveFailed') });
      }
    } catch (error) {
      console.error('Game setting save error:', error);
      notification.error({ message: t('toast.gameSettings.saveError') });
    }
  }, [userId, loadHiddenGames, handleSearch, searchResult]);



  const columns = [
    {
      title: t('userGameSettings.gameName'),
      dataIndex: 'game_name',
      key: 'game_name',
      render: (text: string, record: GameSettingItem) => (
        <Space direction="vertical" size="small">
          <span>{text}</span>
          {record.game_name_en && <span style={{ color: '#888', fontSize: '12px' }}>{record.game_name_en}</span>}
        </Space>
      ),
    },
    {
      title: t('userGameSettings.gameKey'),
      dataIndex: 'game_key',
      key: 'game_key',
    },
    {
      title: t('userGameSettings.vendor'),
      dataIndex: 'vendor_id',
      key: 'vendor_id',
    },
    {
      title: t('userGameSettings.category'),
      dataIndex: 'game_category',
      key: 'game_category',
    },
    {
      title: t('userGameSettings.status'),
      key: 'status',
              render: (_: any, record: GameSettingItem) => {
          // use is_hidden value returned by backend (boolean)
          if (record.is_hidden === true) {
            return <Tag color="red">{t('userGameSettings.hidden')}</Tag>;
          }
          // if is_hidden is false or undefined, show it
          return <Tag color="green">{t('userGameSettings.shown')}</Tag>;
        },
    },
    {
      title: t('userGameSettings.hideSetting'),
      key: 'is_hidden',
              render: (_: any, record: GameSettingItem) => {
          // use is_hidden value returned by backend (boolean -> number)
          let currentValue;
          if (record.is_hidden === true) {
            currentValue = 1;
          } else if (record.is_hidden === false) {
            currentValue = 0;
          } else {
            currentValue = 0; // default when undefined
          }

          return (
            <Select
              style={{ width: 80 }}
              value={currentValue}
              onChange={(value) => handleUpdateGameSetting(record.id, 'is_hidden', value)}
            >
              <Select.Option value={0}>{t('userGameSettings.shown')}</Select.Option>
              <Select.Option value={1}>{t('userGameSettings.hidden')}</Select.Option>
            </Select>
          );
        },
    },
    {
      title: t('userGameSettings.displayOrder'),
      key: 'display_order',
      render: (_: any, record: GameSettingItem) => (
        <Input
          style={{ width: 80 }}
          type="number"
          placeholder={t('userGameSettings.orderPlaceholder')}
          defaultValue={record.hasSettings ? (record.display_order ?? '') : ''}
          onBlur={(e) => {
            const value = e.target.value === '' ? null : parseInt(e.target.value);
            const currentValue = record.hasSettings ? record.display_order : null;
            if (value !== currentValue) {
              handleUpdateGameSetting(record.id, 'display_order', value);
            }
          }}
        />
      ),
    },
  ];

  // column definitions for the hidden game list
  const hiddenGamesColumns = [
    {
      title: t('userGameSettings.gameName'),
      dataIndex: 'game_name',
      key: 'game_name',
      render: (text: string, record: HiddenGameItem) => (
        <Space direction="vertical" size="small">
          <span>{text}</span>
          {record.game_name_en && <span style={{ color: '#888', fontSize: '12px' }}>{record.game_name_en}</span>}
        </Space>
      ),
    },
    {
      title: t('userGameSettings.gameKey'),
      dataIndex: 'game_key',
      key: 'game_key',
    },
    {
      title: t('userGameSettings.vendor'),
      dataIndex: 'vendor_id',
      key: 'vendor_id',
    },
    {
      title: t('userGameSettings.category'),
      dataIndex: 'game_category',
      key: 'game_category',
    },
    {
      title: t('userGameSettings.provider'),
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: t('userGameSettings.displayOrder'),
      dataIndex: 'display_order',
      key: 'display_order',
      width: 100,
      render: (value: number | null) => value ?? '-',
    },
    {
      title: t('userGameSettings.settingDate'),
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 150,
      render: (value: string) => new Date(value).toLocaleString('ko-KR'),
    },
    {
      title: t('userGameSettings.action'),
      key: 'action',
      width: 80,
      render: (_: any, record: HiddenGameItem) => (
        <Popconfirm
          title={t('userGameSettings.unhideConfirm')}
          description={t('userGameSettings.unhideDesc')}
          onConfirm={() => handleUpdateGameSetting(record.id, 'is_hidden', 0)}
          okText={t('global.true')}
          cancelText={t('global.false')}
        >
          <Button size="small" type="primary" ghost>
            {t('userGameSettings.unhide')}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Panel title={t('userGameSettings.hiddenListTitle')}>
        {hiddenGames.length > 0 ? (
          <Table
            columns={hiddenGamesColumns}
            dataSource={hiddenGames}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (total) => t('userGameSettings.totalHidden', { count: total }),
            }}
            scroll={hiddenGames.length > 0 ? { x: 'max-content' } : undefined}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            {t('userGameSettings.noHiddenGames')}
          </div>
        )}
      </Panel>

      <Panel title={t('userGameSettings.addEditTitle')}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Input
            placeholder={t('userGameSettings.searchPlaceholder')}
            value={searchParams.q}
            onChange={(e) => setSearchParams({ ...searchParams, q: e.target.value })}
            onPressEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSearch();
            }}
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder={t('userGameSettings.category')}
            style={{ width: '100%' }}
            allowClear
            value={searchParams.category || undefined}
            onChange={(value) => setSearchParams({ ...searchParams, category: value || '' })}
          >
            <Select.Option value="slot">{t('userGameSettings.catSlot')}</Select.Option>
            <Select.Option value="live">{t('userGameSettings.catLive')}</Select.Option>
            <Select.Option value="sports">{t('userGameSettings.catSports')}</Select.Option>
            <Select.Option value="minigame">{t('userGameSettings.catMini')}</Select.Option>
          </Select>
        </Col>
        <Col span={4}>
          <Input
            placeholder={t('userGameSettings.vendorPlaceholder')}
            value={searchParams.vendor_id}
            onChange={(e) => setSearchParams({ ...searchParams, vendor_id: e.target.value })}
            onPressEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSearch();
            }}
          />
        </Col>
        <Col span={4}>
          <Select
            style={{ width: '100%' }}
            value={searchParams.limit}
            onChange={(value) => setSearchParams({ ...searchParams, limit: value })}
          >
            <Select.Option value={20}>{t('userGameSettings.countItems', { count: 20 })}</Select.Option>
            <Select.Option value={50}>{t('userGameSettings.countItems', { count: 50 })}</Select.Option>
            <Select.Option value={100}>{t('userGameSettings.countItems', { count: 100 })}</Select.Option>
          </Select>
        </Col>
        <Col span={6}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={isLoading}
          >
            {t('global.search')}
          </Button>
        </Col>
      </Row>

             <Table
         columns={columns}
         dataSource={filteredGames}
         rowKey="id"
         loading={isLoading}
         pagination={{
           pageSize: searchParams.limit,
           showSizeChanger: false,
           showTotal: (total) => t('userGameSettings.totalGames', { count: total }),
         }}
         scroll={filteredGames.length > 0 ? { x: 'max-content' } : undefined}
       />
    </Panel>
    </>
  );
};

export default UserGameSettings;
