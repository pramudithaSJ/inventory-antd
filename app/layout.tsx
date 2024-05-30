import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CustomerProvider } from "@/context/customer-context";
import { CategoryProvider } from "@/context/category-context";
import { ItemProvider } from "@/context/item-context";
import { GrnProvider } from "@/context/grn-context";
import { OrderProvider } from "@/context/order-context";
import { UserProvider } from "@/context/user-context";
import { InvoiceProvider } from "@/context/invoice-context";
import { ReceiptProvider } from "@/context/receipt-context";
import { JobProvider } from "@/context/job-context";
import { ChequeProvider } from "@/context/cheque-context";
import { ReportProvider } from "@/context/report-context";
import { RouteProvider } from "@/context/route-context";
import { ExpenseProvider } from "@/context/expenses-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inventory App",
  description: "Developed By pramu.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CategoryProvider>
          <CustomerProvider>
            <ItemProvider>
              <GrnProvider>
                <OrderProvider>
                  <UserProvider>
                    <InvoiceProvider>
                      <ReceiptProvider>
                        <JobProvider>
                          <ChequeProvider>
                            <ReportProvider>
                              <RouteProvider>
                                <ExpenseProvider>
                                  <div>{children}</div>
                                </ExpenseProvider>
                              </RouteProvider>
                            </ReportProvider>
                          </ChequeProvider>
                        </JobProvider>
                      </ReceiptProvider>
                    </InvoiceProvider>
                  </UserProvider>
                </OrderProvider>
              </GrnProvider>
            </ItemProvider>
          </CustomerProvider>
        </CategoryProvider>
      </body>
    </html>
  );
}
