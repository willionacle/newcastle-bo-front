import axios, { AxiosResponse } from "axios";
import { PostAddBanner, PostAddBlockIP, PostAddBulkCoupon, PostAddCoupon, PostAddDepositBonus, PostAddEvent, PostAddHero, PostAddLevel, PostAddLevelDeposit, PostAddMessage, PostAddNotice, PostAddRes, PostAddWhiteIP, PostAgentList, PostAgentTreeList, PostAPERes, PostBannerList, PostBlockIPList, PostCreateAgentBody, PostCreateUserBody, PostDeleteBlockIP, PostDeleteBlockIPRes, PostDeleteCouponApp, PostDeleteItem, PostDepositInUse, PostEventList, PostGameList, PostGetBannerRes, PostGetDepBonusRes, PostGetHeroRes, PostGetItem, PostGetItemByUsername, PostGetLevelDepRes, PostGetLevelRes, PostGetNoticeRes, PostHeroList, PostLoginList, PostNoticeList, PostPhoneLogList, PostRes, PostSMSLogList, PostToggleGame, PostTogglVendor, PostUpdateBanner, PostUpdateEvent, PostUpdateHero, PostUpdateLevel, PostUpdateNotice, PostUpdateTrans, PostUpdateUserBody, PostUserList, PostWhiteIPList, ResPostList, ResUser, PostAddRegulation, PostGetRegulationRes, PostUpdateRegulation, PostGetMessageTemplate, PostTogglPopular, PostToggleStream, PostScAddEvent, PostToggleScEvent, PostToggleScCategory, PostScAddChatWord, PostToggleScForbidWord, PostToggleChatAllow, PostToggleChatAllowDelete, PostToggleChatIsAdmin } from "./types";
import { WithdrawalBetSummaryData } from "./withdrawal-detail/post";
import { stringify } from "qs";
import { prepareRestApiData } from "@/utils/caseConverter";
import i18n from "@/i18n/i18n";

declare module "axios" {
  export interface AxiosRequestConfig {
    // Opt out of the global error notification in PrivateRouter.tsx for calls
    // that handle their own failures. 401 still logs the operator out — this
    // only suppresses the raw "Request failed with status code N" toast.
    silent?: boolean;
  }
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// i18next uses "fil" internally for Filipino; the API expects the ISO code "tl".
const ACCEPT_LANGUAGE_MAP: Record<string, string> = { fil: "tl" };

instance.interceptors.request.use((config) => {
  const lng = i18n.language?.split("-")[0] ?? "en";
  config.headers.set("Accept-Language", ACCEPT_LANGUAGE_MAP[lng] ?? lng);
  return config;
});

export const api = {
	userList 			: (data: PostUserList, token: string) 		=> instance.get<PostUserList, AxiosResponse<ResPostList>>(`/userlist?${stringify(data)}`, { headers: {'Authorization': `Bearer ${token}`}}),
	agentList 			: (data: PostAgentList, token: string) 		=> instance.get<PostAgentList, AxiosResponse<ResPostList>>(`/agent/list?${stringify(data)}`,{ headers: {'Authorization': `Bearer ${token}`}}),
	agentTreeList		: (data: PostAgentTreeList, token: string)	=> instance.post<PostAgentTreeList, AxiosResponse<ResPostList>>('/agent/list', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	agentDropdownList 	: (data: PostAgentList, token: string) 		=> instance.post<PostAgentList, AxiosResponse<ResPostList>>('/agentdropdownlist', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	loginList 			: (data: PostLoginList, token: string) 		=> instance.post<PostLoginList, AxiosResponse<ResPostList>>('/loginlist', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	eventList 			: (data: PostEventList, token: string) 		=> instance.post<PostEventList, AxiosResponse<ResPostList>>('/eventlist', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	bannerList 			: (data: PostBannerList, token: string)		=> instance.post<PostBannerList, AxiosResponse<ResPostList>>('/bannerlist', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	heroList 			: (data: PostHeroList, token: string)		=> instance.post<PostHeroList, AxiosResponse<ResPostList>>('/herolist', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	noticeList 			: (data: PostNoticeList, token: string)		=> instance.post<PostNoticeList, AxiosResponse<ResPostList>>('/noticelist', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	whiteIPList 		: (data: PostWhiteIPList, token: string) 	=> instance.post<PostWhiteIPList, AxiosResponse<ResPostList>>('/whiteiplist', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	blockIPList 		: (data: PostBlockIPList, token: string) 	=> instance.post<PostBlockIPList, AxiosResponse<ResPostList>>('/blockiplist', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	smsLogList 			: (data: PostSMSLogList, token: string) 	=> instance.post<PostSMSLogList, AxiosResponse<ResPostList>>('/smslog', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	phoneLogList 		: (data: PostPhoneLogList, token: string) 	=> instance.post<PostPhoneLogList, AxiosResponse<ResPostList>>('/phonelog', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	gameList			: (data: PostGameList, token: string) 		=> instance.post<PostGameList, AxiosResponse<ResPostList>>('/gamelist', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createUser 			: (data: PostCreateUserBody, token: string) => instance.post<PostCreateUserBody, AxiosResponse<ResUser>>('/adduser', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createAgent			: (data: PostCreateAgentBody, token: string) => instance.post<PostCreateAgentBody, AxiosResponse<ResUser>>('/addagent', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createEvent			: (data: PostAddEvent, token: string) 		=> instance.post<PostAddEvent, AxiosResponse<PostAddRes>>('/addevent', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createBanner		: (data: PostAddBanner, token: string) 		=> instance.post<PostAddBanner, AxiosResponse<PostAddRes>>('/addbanner', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createHero			: (data: PostAddHero, token: string) 		=> instance.post<PostAddHero, AxiosResponse<PostAddRes>>('/addhero', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createNotice		: (data: PostAddNotice, token: string) 		=> instance.post<PostAddHero, AxiosResponse<PostAddRes>>('/addnotice', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createLevel			: (data: PostAddLevel, token: string)		=> instance.post<PostAddLevel, AxiosResponse<PostAddRes>>('/insertlevelconfig', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createMessage		: (data: PostAddMessage, token: string)		=> instance.post<PostAddMessage, AxiosResponse<PostAddRes>>('/addmessage', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createLevelDeposit	: (data: PostAddLevelDeposit, token: string)=> instance.post<PostAddLevelDeposit, AxiosResponse<PostAddRes>>('/insertlevelaccount', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createDepositBonus	: (data: PostAddDepositBonus, token: string)=> instance.post<PostAddDepositBonus, AxiosResponse<PostAddRes>>('/adddepositbonus', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createCoupon		: (data: PostAddCoupon, token: string)		=> instance.post<PostAddCoupon, AxiosResponse<PostAddRes>>('/addcoupon', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createBulkCoupon	: (data: PostAddBulkCoupon, token: string)	=> instance.post<PostAddBulkCoupon, AxiosResponse<PostAddRes>>('/addbulkcoupon', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createBlockIP		: (data: PostAddBlockIP, token: string)		=> instance.post<PostAddBlockIP, AxiosResponse<PostAddRes>>('/addblockip', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createWhiteIP		: (data: PostAddWhiteIP, token: string)		=> instance.post<PostAddWhiteIP, AxiosResponse<PostAddRes>>('/addwhiteip', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	depositSetInuse		: (data: PostDepositInUse, token: string)		=> instance.post<PostDepositInUse, AxiosResponse<PostAddRes>>('/depositsetinuse', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	getUser 			: (data: PostGetItem, token: string) 		=> instance.post<PostGetItem, AxiosResponse<ResUser>>('/getuser', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	getEvent 			: (data: PostGetItem, token: string) 		=> instance.post<PostGetItem, AxiosResponse<PostAPERes>>('/getevent', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	getBanner 			: (data: PostGetItem, token: string) 		=> instance.post<PostGetItem, AxiosResponse<PostAPERes>>('/getbanner', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	getHero 			: (data: PostGetItem, token: string) 		=> instance.post<PostGetItem, AxiosResponse<PostGetHeroRes>>('/gethero', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	getNotice 			: (data: PostGetItem, token: string) 		=> instance.post<PostGetItem, AxiosResponse<PostGetNoticeRes>>('/getnotice', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	getLevel 			: (data: PostGetItem, token: string) 		=> instance.post<PostGetItem, AxiosResponse<PostGetLevelRes>>('/getlevelconfig', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	getLevelDeposit		: (data: PostGetItem, token: string) 		=> instance.post<PostGetItem, AxiosResponse<PostGetLevelDepRes>>('/getlevelaccount', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	getDepositBonus		: (data: PostGetItem, token: string) 		=> instance.post<PostGetItem, AxiosResponse<PostGetDepBonusRes>>('/getdepositbonus', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	updateUser 			: (data: PostUpdateUserBody, token: string) => {
		// snake_case → camelCase + parentID 정규화
		const apiData = prepareRestApiData(data);
		return instance.put<any, AxiosResponse<{
			code: number;
			message: string;
			data: { success: boolean; message: string };
		}>>('/api/users', apiData, { headers: {'Authorization': `Bearer ${token}`}});
	},
	updateAgent			: (data: any, token: string) => instance.post<PostUpdateUserBody, AxiosResponse<ResUser>>('/updateagent', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	updateEvent			: (data: PostUpdateEvent, token: string)	=> instance.post<PostUpdateEvent, AxiosResponse<PostAPERes>>('/updateevent', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	updateBanner		: (data: PostUpdateBanner, token: string)	=> instance.post<PostUpdateBanner, AxiosResponse<PostAPERes>>('/updatebanner', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	updateHero			: (data: PostUpdateHero, token: string)		=> instance.post<PostUpdateHero, AxiosResponse<PostAPERes>>('/updatehero', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	updateNotice		: (data: PostUpdateNotice, token: string)	=> instance.post<PostUpdateNotice, AxiosResponse<PostAPERes>>('/updatenotice', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	updateLevel			: (data: PostUpdateLevel, token: string)	=> instance.post<PostUpdateLevel, AxiosResponse<PostAPERes>>('/updatelevelconfig', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	updateLevelDeposit	: (data: PostAddLevelDeposit, token: string)=> instance.post<PostAddLevelDeposit, AxiosResponse<PostAPERes>>('/updatelevelaccount', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	updateDepositBonus	: (data: PostAddDepositBonus, token: string)=> instance.post<PostAddDepositBonus, AxiosResponse<PostAPERes>>('/updatedepositbonus', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	updateWithdraw		: (data: PostUpdateTrans, token: string)	=> instance.post<PostUpdateTrans, AxiosResponse<PostAPERes>>('/updatewithdraw2', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	updateAgentWithdraw	: (data: PostUpdateTrans, token: string)	=> instance.post<PostUpdateTrans, AxiosResponse<PostAPERes>>('/updateagentwithdraw', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	updateDeposit		: (data: PostUpdateTrans, token: string)	=> instance.post<PostUpdateTrans, AxiosResponse<PostAPERes>>('/updatedeposit', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	deleteBlockIP 		: (data: PostDeleteBlockIP, token: string) 	=> instance.post<PostDeleteBlockIP, AxiosResponse<PostDeleteBlockIPRes>>('/deleteblockip', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	deleteEvent			: (data: PostDeleteItem, token: string)		=> instance.post<PostDeleteItem, AxiosResponse<PostAPERes>>('/deleteevent', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	deleteBanner		: (data: PostDeleteItem, token: string)		=> instance.post<PostDeleteItem, AxiosResponse<PostGetBannerRes>>('/deletebanner', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	deleteHero			: (data: PostDeleteItem, token: string)		=> instance.post<PostDeleteItem, AxiosResponse<PostGetHeroRes>>('/deletehero', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	deleteNotice		: (data: PostDeleteItem, token: string)		=> instance.post<PostDeleteItem, AxiosResponse<PostGetNoticeRes>>('/deletenotice', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	deleteLevelDep		: (data: PostDeleteItem, token: string)		=> instance.post<PostDeleteItem, AxiosResponse<PostGetLevelDepRes>>('/deletelevelaccount', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	deleteDepBonus		: (data: PostDeleteItem, token: string)		=> instance.post<PostDeleteItem, AxiosResponse<PostGetDepBonusRes>>('/deletedepositbonus', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	cancelCouponApp		: (data: PostDeleteCouponApp, token: string)=> instance.post<PostDeleteCouponApp, AxiosResponse<PostRes<undefined>>>('/deletecouponapplication', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	toggleGame			: (data: PostToggleGame, token: string)		=> instance.post<PostToggleGame, AxiosResponse<PostRes<any>>>('/togglegame', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	toggleVendor		: (data: PostTogglVendor, token: string)	=> instance.post<PostTogglVendor, AxiosResponse<PostRes<any>>>('/togglevendor', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	withdrawBetSum		: (data: PostGetItemByUsername, token: string)		=> instance.post<PostGetItemByUsername, AxiosResponse<WithdrawalBetSummaryData>>('/withdrawbetresultsummary', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	getDepositList		: (data: any, token: string)		=> instance.get<undefined, AxiosResponse<ResPostList>>(`/depositlist?${data}`, { headers: {'Authorization': `Bearer ${token}`}}),
	getWtihdrawList		: (data: any, token: string)		=> instance.get<undefined, AxiosResponse<ResPostList>>(`/withdrawlist?${data}`, { headers: {'Authorization': `Bearer ${token}`}}),
	createRegulation	: (data: PostAddRegulation, token: string) 		=> instance.post<PostAddRegulation, AxiosResponse<PostAddRes>>('/addregulation', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	updateRegulation	: (data: PostUpdateRegulation, token: string) 		=> instance.post<PostUpdateRegulation, AxiosResponse<PostAddRes>>('/updateregulation', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	getRegulation 			: (data: PostGetItem, token: string) 		=> instance.get<PostGetItem, AxiosResponse<PostGetRegulationRes>>(`/getregulation?${stringify(data)}`,{ headers: {'Authorization': `Bearer ${token}`}}),
	searchGames 			: (data: any, token: string) 				=> instance.get<any, AxiosResponse<any>>(`/search-games?${stringify(data)}`,{ headers: {'Authorization': `Bearer ${token}`}}),
	upsertGameSettings 		: (data: any, token: string) 				=> instance.post<any, AxiosResponse<any>>('/upsert-game-settings', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	getUserHiddenGames 		: (data: any, token: string) 				=> instance.get<any, AxiosResponse<any>>(`/get-hidden-games?${stringify(data)}`,{ headers: {'Authorization': `Bearer ${token}`}}),
	getMessageTemplate: (data: PostGetItem, token: string) 		=> instance.get<PostGetItem, AxiosResponse<PostGetMessageTemplate>>(`/getmessagetemplate?userid=${data.userid}&id=${data.id}`,{ headers: {'Authorization': `Bearer ${token}`}}),
	getGradePolicies		: (data: { userid: number }, token: string) => instance.get<any, AxiosResponse<any>>(`/get-grade-policies?${stringify(data)}`, { headers: {'Authorization': `Bearer ${token}`}}),
	updateGradePolicy		: (data: any, token: string)				=> instance.post<any, AxiosResponse<any>>('/update-grade-policy', data, { headers: {'Authorization': `Bearer ${token}`}}),
	getGlobalConfig			: (data: { userid: number }, token: string) => instance.get<any, AxiosResponse<any>>(`/get-global-level-min-daily-betting?${stringify(data)}`, { headers: {'Authorization': `Bearer ${token}`}}),
	updateGlobalConfig		: (data: any, token: string)				=> instance.post<any, AxiosResponse<any>>('/update-global-level-min-daily-betting', data, { headers: {'Authorization': `Bearer ${token}`}}),
	getBalanceLogsList		: (data: any, token: string)				=> instance.get<undefined, AxiosResponse<ResPostList>>(`/api/balance-logs?${data}`, { headers: {'Authorization': `Bearer ${token}`}}),
	togglePopular		: (data: PostTogglPopular, token: string)	=> instance.post<PostTogglPopular, AxiosResponse<PostRes<any>>>('/togglepopular', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	toggleStream		: (data: PostToggleStream, token: string)	=> instance.post<PostToggleStream, AxiosResponse<PostRes<any>>>('/updatestreamcommunitylist', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createScEvent		: (data: PostScAddEvent, token: string) 		=> instance.post<PostScAddEvent, AxiosResponse<PostAddRes>>('/createscevent', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	updateScEvent		: (data: PostScAddEvent, token: string)	=> instance.post<PostScAddEvent, AxiosResponse<PostAddRes>>('/updatescevent', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	deleteScEvent			: (data: any, token: string)		=> instance.post<PostDeleteItem, AxiosResponse<any>>('/deletescevent', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	toggleScEvent		: (data: PostToggleScEvent, token: string)	=> instance.post<PostToggleScEvent, AxiosResponse<PostRes<any>>>('/updatesceventvisible', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	toggleScCategory: (data: PostToggleScCategory, token: string)	=> instance.post<PostToggleScCategory, AxiosResponse<PostRes<any>>>('/updatesccategoryvisible', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	toggleScLeague  : (data: PostToggleScCategory, token: string)	=> instance.post<PostToggleScCategory, AxiosResponse<PostRes<any>>>('/updatescleaguevisible', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	createChatForbiddenWords		: (data: PostScAddChatWord, token: string) 		=> instance.post<PostScAddChatWord, AxiosResponse<PostAddRes>>('/createscchatforbiddenwords', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	toggleChatForbidWord: (data: PostToggleScForbidWord, token: string)	=> instance.post<PostToggleScForbidWord, AxiosResponse<PostRes<any>>>('/updatescchatforbiddenwordsallowed', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	toggleChatAllow: (data: PostToggleChatAllow, token: string)	=> instance.post<PostToggleChatAllow, AxiosResponse<PostRes<any>>>('/updatechatuserlistallowed', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	deleteScForbidWord	: (data: any, token: string)		=> instance.post<PostDeleteItem, AxiosResponse<any>>('/deletescchatforbiddenwords', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	toggleChatAllowDelete: (data: PostToggleChatAllowDelete, token: string)	=> instance.post<PostToggleChatAllowDelete, AxiosResponse<PostRes<any>>>('/updatechatuserlistdeleteallowed', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	toggleIsAdmin: (data: PostToggleChatIsAdmin, token: string)	=> instance.post<PostToggleChatIsAdmin, AxiosResponse<PostRes<any>>>('/updatechatuserlistadmin', data,{ headers: {'Authorization': `Bearer ${token}`}}),
	setForcedWithdrawalOff: (token: string) => instance.patch<any, AxiosResponse<PostAddRes>>('/api/users/set-forced-wthdrawal-off', {}, { headers: {'Authorization': `Bearer ${token}`}}),
}

export default instance;

