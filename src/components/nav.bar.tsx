"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useTransition } from "react";
import { Button } from "./ui/button";

interface NavbarProps {}

const Navbar = ({}: NavbarProps) => {
  const [locale, setLocale] = React.useState<string>("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("MYNEXTAPP_LOCALE="))
      ?.split("=")[1];
    if (cookieLocale) {
      setLocale(cookieLocale);
    } else {
      const browserLocale = navigator.language.slice(0, 2);
      setLocale(browserLocale);
      document.cookie = `MYNEXTAPP_LOCALE=${browserLocale}`;
      router.refresh();
    }
  }, [router]);

  const changeLocale = (newlocale: string) => {
    setLocale(newlocale);
    document.cookie = `MYNEXTAPP_LOCALE=${newlocale}`;
    router.refresh();
  };

  return (
    <div>
      <div className="p-4 flex items-center justify-center gap-4">
        <Button
          onClick={() => changeLocale("en")}
          disabled={isPending} // ป้องกันการกดซ้ำระหว่างโหลด
          // ตัวอย่างการเปลี่ยน Style ตาม State
          style={{
            fontWeight: locale === "en" ? "bold" : "normal",
            backgroundColor: locale === "en" ? "black" : "gray",
            color: "white",
          }}
        >
          EN {locale === "en" && "✓"} {/* ใส่เครื่องหมายถูกถ้าเลือกอยู่ */}
        </Button>

        {/* ปุ่มภาษาไทย */}
        <Button
          onClick={() => changeLocale("th")}
          disabled={isPending}
          style={{
            fontWeight: locale === "th" ? "bold" : "normal",
            backgroundColor: locale === "th" ? "black" : "gray",
            color: "white",
          }}
        >
          TH {locale === "th" && "✓"}
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
