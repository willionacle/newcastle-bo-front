import i18next from "@/i18n/i18n";
import moment from "moment";

interface DateDiffOptions {
  suffix?: string;
  prefix?: string;
}

export const GF = {
  formatDate(date: any, time: boolean) {
    if (date) {
      try {
        const formattedDate = moment(date).format(
          time ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"
        );
        return formattedDate;
      } catch (error) {
        console.error(error);
        return null;
      }
    } else {
      return null;
    }
  },
  cleanDateString(date: any, time: boolean, convertToLocal: boolean = false) {
    if (date) {
      const dateString = date.replace("T", " ").replace("Z", "").split(".")[0];
      if (dateString) {
        try {
          let m = moment.utc(dateString); // parse as UTC

          if (convertToLocal) {
            m = m.tz("Asia/Tokyo");
          }

          const formattedDate = m.format(
            time ? "YY-MM-DD HH:mm:ss" : "YY-MM-DD"
          );
          return formattedDate;
        } catch (e) {
          return "-";
        }
      } else {
        return "-";
      }
    } else {
      return "-";
    }
  },
  parseFileName(str: string) {
    try {
      if (str) {
        return JSON.parse(str)[0];
      }
    } catch (e) {
      return undefined;
    }
  },
  dateDifference(
    date1: string | null | Date,
    date2: string | null | Date,
    option?: DateDiffOptions
  ) {
    const data = {
      suffix: option?.suffix ?? "",
      prefix: option?.prefix ?? "",
      value: 0,
      result: `${option?.prefix ?? ""}${Math.abs(0)}${option?.suffix ?? ""}`,
    };

    if (date1 && date2) {
      try {
        const d1 = moment(date1);
        const d2 = moment(date2);
        console.log(d1, d2);
        const dateDiff = d1.diff(d2, "days");

        return {
          ...data,
          value: dateDiff,
          result: `${data.prefix}${Math.abs(dateDiff)}${data.suffix}`,
        };
      } catch (e) {
        console.error(e);
        return data;
      }
    } else {
      return data;
    }
  },
  handleGradeStrVal(grade: number | null) {
    let str = "-";

    switch (grade) {
      case null:
        str = "-";
        break;
      case 0:
        str = "-";
        break;
      case 1:
        str = i18next.t("grade.bronze"); // BRONZE
        break;
      case 2:
        str = i18next.t("grade.silver"); // SILVER
        break;
      case 3:
        str = i18next.t("grade.gold"); // GOLD
        break;
      case 4:
        str = i18next.t("grade.emerald"); // EMERALD
        break;
      case 5:
        str = i18next.t("grade.ruby"); // RUBY
        break;
      case 6:
        str = i18next.t("grade.diamond"); // DIAMOND
        break;
      case 7:
        str = i18next.t("grade.blackDiamond"); // BLACK DIAMOND
        break;

      default:
        str = "-";
        break;
    }

    return str;
  },
  handleGradeIntVal(grade: string | null) {
    let int = 0;

    switch (grade) {
      case null:
        int = 0;
        break;
      case "":
        int = 0;
        break;
      case "브론즈":
        int = 1;
        break;
      case "실버":
        int = 2;
        break;
      case "골드":
        int = 3;
        break;
      case "에메랄드":
        int = 4;
        break;
      case "루비":
        int = 5;
        break;
      case "다이아몬드":
        int = 6;
        break;
      case "블랙다이아":
        int = 7;
        break;

      default:
        int = 0;
        break;
    }

    return int;
  },
  topAgentUsername: (name: string) =>
    name === "master" ? import.meta.env.VITE_AGENT_TOP : name ?? "",
  translateRollingType: (rolling: string) => {
    let translated = rolling;
    switch (rolling) {
      case "OFF":
        translated = i18next.t("user.noPayment");
        break;
      case "LEVEL":
        translated = i18next.t("user.levelBasedSetting");
        break;
      case "INDIVIDUAL":
        translated = i18next.t("user.individualSetting");
        break;
      case "AGENT":
        translated = i18next.t("text.distributorSetting");
        break;
      default:
        translated = rolling;
        break;
    }

    return translated;
  },
  firstDayOfMonth: (format: string | undefined = "YYYY-MM-DD") =>
    moment().startOf("month").format(format),
  lastDayOfMonth: (format: string | undefined = "YYYY-MM-DD") =>
    moment().endOf("month").format(format),
  trimWalletAddress(address: string, startLength = 6, endLength = 4) {
    if (address.length <= startLength + endLength) {
      return address; // No need to trim if the address is already short
    }
    const start = address.substring(0, startLength);
    const end = address.substring(address.length - endLength);
    return `${start}...${end}`;
  },
  noOrderFormatter: ({
    totalItems,
    page,
    limit,
    index,
  }: {
    totalItems: number;
    page: number;
    limit: number;
    index: number;
  }) => totalItems - (page - 1) * limit - index,
  shortenFilename(filename: string, maxLength = 10) {
    const parts = filename.split(".");
    const extension = parts.pop(); // Get the file extension
    const name = parts.join("."); // Rejoin in case there were multiple dots

    if (name.length <= maxLength) {
      return filename; // No need to shorten
    }

    const start = name.slice(0, 5); // First 5 characters
    const end = name.slice(-3); // Last 3 characters before extension

    return `${start}...${end}.${extension}`;
  },
  getDeviceInfo(userAgent: string) {
    const device = /Mobi|Android/i.test(userAgent) ? "mobile" : "desktop";

    const osMatch = userAgent.match(
      /(Windows NT|Mac OS X|Android|iPhone OS|iPad OS|iOS) ([\d_\.]+)/
    );
    const system = osMatch
      ? osMatch[1].replace("_", ".") + " " + osMatch[2]
      : "Unknown OS";

    const browserMatch = userAgent.match(
      /(Chrome|Firefox|Safari|Edge|Opera)[/\s]([\d\.]+)/
    );
    const browser = browserMatch
      ? browserMatch[1] + " " + browserMatch[2]
      : "Unknown Browser";

    return { device, system, browser };
  },
  convertToGMT(date: string, format = "YYYY-MM-DD HH:mm:ss") {
    if (!date) return null;
    try {
      return moment.utc(date).tz("Asia/Seoul").format(format);
    } catch (error) {
      console.error("Error converting to KST (GMT+9):", error);
      return null;
    }
  },
  translateTransactionStatus(status: string) {
    const krText: Record<string, string> = {
      Applied: i18next.t("status.requesting"),
      Completed: i18next.t("global.complete"),
      Waiting: i18next.t("global.waiting"),
    };

    return krText[status] || "-";
  },
  // 입금 id 49 (2026-09-02) 이전 건은 저장 프로시저 인자가 한 칸 밀려서
  // payment_method 에 status 가 저장되어 있다. 원본 값은 복구할 수 없으므로
  // 표시하지 않는다. id 50 부터는 bank/usdt/oncash/jeju-virtual 이 정상 기록된다.
  isLegacyPaymentMethod(value?: string | null) {
    return (
      !value || ["Waiting", "Cancelled", "Completed", "Applied"].includes(value)
    );
  },
  depositCSVData(data: any) {
    const arr: any[] = [];
    if (data !== undefined && data !== null && data.length > 0) {
      data.map((item: any) => {
        arr.push({
          순서: item.RowNum, // 1
          총판: item.agent_username ?? "", // 2
          추천인: item.referral_username ?? "", // 3
          아이디: item.username, // 4
          이름: item.user_real_name, // 5
          등급: item.user_grade, // 6
          레벨: item.user_level, // 7
          생일: item.userbday, // 8
          회원상태: item.user_status, // 9
          금액: item.amount, // 10
          "테더입금 수량": item.usdt_amount, // 11
          상태: GF.translateTransactionStatus(item.status), // 12
          보너스명: item.bonus_name, // 13
          자동승인: item.auto_process_status, // 14
          "최근 입금": GF.cleanDateString(item.last_deposit, true), // 15
          신청일시: GF.cleanDateString(item.created_at, true), // 16
          처리일시: GF.cleanDateString(item.updated_at, true), // 17
          입금수단: GF.isLegacyPaymentMethod(item.payment_method)
            ? ""
            : item.payment_method, // 18
        });
      });
    }
    return arr;
  },
  withdrawCSVData(data: any) {
    const arr: any[] = [];
    if (data !== undefined && data !== null && data.length > 0) {
      data.map((item: any) => {
        arr.push({
          순서: item.RowNum, // 1
          총판: item.agent_username ?? "", // 2
          추천인: item.referral_username ?? "", // 3
          아이디: item.username, // 4
          이름: item.user_real_name, // 5
          등급: item.user_grade, // 6
          레벨: item.user_level, // 7
          생일: item.userbday, // 8
          회원상태: item.user_status, // 9
          은행: item.bank_name, // 9a
          출금계좌번호: item.account_number, // 9b
          예금주: item.account_name, // 9c
          금액: item.amount, // 10
          "테더입금 수량": item.usdt_amount, // 11
          상태: GF.translateTransactionStatus(item.status), // 12
          // "보너스명": item.bonus_name, // 13
          // "자동승인": item.auto_process_status, // 14
          // "최근 입금": GF.cleanDateString(item.last_deposit, true), // 15
          신청일시: GF.cleanDateString(item.created_at, true), // 16
          처리일시: GF.cleanDateString(item.updated_at, true), // 17
          입금수단: item.last_deposit_type, // 18
        });
      });
    }
    return arr;
  },
  isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  },
  balanceLogsCSVData(data: any) {
    const arr: any[] = [];
    if (data !== undefined && data !== null && data.length > 0) {
      data.map((item: any, index: number) => {
        arr.push({
          순서: index + 1,
          에이전트: item.agentUsername ?? "",
          사용자명: item.username,
          실명: item.userRealName ?? "",
          레벨: item.userLevel ?? "-",
          등급: item.userGrade ?? "-",
          변동금액: item.amount,
          기록유형: item.recordType ?? "-",
          이전잔액: item.prevBalance ?? "-",
          변경후잔액: item.afterBalance ?? "-",
          시스템메모: item.systemNote ?? "",
          게임ID: item.gameId ?? "-",
          게임카테고리: item.gameCategory ?? "-",
          생성일시: GF.cleanDateString(item.createdAt, true),
          수정일시: GF.cleanDateString(item.updatedAt, true),
        });
      });
    }
    return arr;
  },
  isOverFiveMinutes(dateStr: string) {
    if (!dateStr) return false;

    const cleanDateStr = GF.cleanDateString(dateStr, true);

    // Expecting format: "YY-MM-DD HH:mm:ss"
    const [datePart, timePart] = cleanDateStr.split(" ");
    const [yy, mm, dd] = datePart.split("-").map(Number);
    const [hh, min, ss] = timePart.split(":").map(Number);

    const year = 2000 + yy;
    const month = mm - 1; // months in JS start at 0

    const givenDate = new Date(year, month, dd, hh, min, ss);
    const diff = Date.now() - givenDate.getTime();

    return diff > 300000;
  },
  getGradeDisplay(params: {
    userGrade?: number | null | undefined;
    userGradeDay?: number | null | undefined;
    localGradeConfig?: string | null;
    isRecentDeposit?: boolean;
  }): string {
    const { userGrade, userGradeDay, localGradeConfig, isRecentDeposit } =
      params;

    const grade = userGrade ?? null;
    const gradeDay = userGradeDay ?? null;

    const gradeStr = GF.handleGradeStrVal(grade);

    // manual이면 M 표시
    if (localGradeConfig === "manual") {
      return `${gradeStr} M`;
    }

    // user_grade=1이고 user_grade_day=0일 때 특별 처리
    if (grade === 1 && gradeDay === 0) {
      const gradeDayDisplay = isRecentDeposit ? "0.5" : "0";
      return `${gradeStr} ${gradeDayDisplay}`;
    }

    return `${gradeStr} ${gradeDay ?? "-"}`;
  },
  translateToKorean:async (text: string): Promise<string> => {
    if (!text) return "";
    try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(
        text
      )}`
    );

    const json = await res.json();
    return json[0][0][0] || text;
  } catch (e) {
    console.error("Google free translate error:", e);
    return text;
  }
  },
  withdrawOncashMessage(pin: string, refId?: string) {
    return [
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "text": i18next.t("text.pinNumberLabel"),
            "bold": true,
            "color": "#e20707"
          },
          {
            "type": "text",
            "text": `${pin ?? " "}`,
            "bold": true
          }
        ]
      },
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "color": "#000000",
            "text": i18next.t("text.verificationCodeLabel")
          },
          {
            "type": "text",
            "color": "#000000",
            "text": `${refId ?? ""}`,
            "bold": true
          }
        ]
      },
    ]
  },
  getFileNameFromDisposition(
    disposition: unknown,
    fallback = i18next.t("text.membersAllXlsx")
  )  {
    if (typeof disposition !== "string") return fallback;

    const m = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)"?/i);
    if (!m?.[1]) return fallback;

    try {
      return decodeURIComponent(m[1]);
    } catch {
      return m[1];
    }
  }
};
