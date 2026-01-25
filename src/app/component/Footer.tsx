export default function Footer() {
    return (
        <footer className="grid grid-cols-4 gap-4 text-center bg-accent font-bold">
            <div>
                Hình
                <p>Tên</p>
                <p>SDT</p>
                <p>EMAIL</p>
            </div>
            <div>
                <label>Danh sách các đồ án</label>
                <ul>
                    <li>Đồ án 1</li>
                    <li>Đồ án 2</li>
                    <li>Đồ án 3</li>
                    <li>Đồ án 4</li>
                </ul>
            </div>
            <div>
                <label>Thầy hướng dẫn</label>
                <ul>
                    <li>Thầy 1</li>
                    <li>Thầy 2</li>
                </ul>
            </div>
            <div>
                <label>Bằng cấp</label>
                <ul>
                    <li>CDKT Cao Thang</li>
                </ul>
            </div>
        </footer>
    )
}

