import Sidebar from '../components/Sidebar';

export default function AIGatewayV2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f4f5]">
      <Sidebar />
      <div className="ml-[190px]">
        <main className="pl-[30px] pr-[30px] pt-[20px] pb-[20px]">
          {children}
        </main>
      </div>
    </div>
  );
}
